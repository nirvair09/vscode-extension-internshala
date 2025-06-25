import * as vscode from 'vscode';
import { getWebviewContent } from './getWebViewContent';
import { callGeminiAPI } from './gemini';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('ai-chat-assistant.start', () => {
      const panel = vscode.window.createWebviewPanel(
        'aiChatAssistant',
        'AI Chat Assistant',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
        }
      );

      panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === 'userPrompt') {
            let contextText = '';
            let imageBase64: string | null = null;

            if (message.file) {
              // Find and read the mentioned file
              const files = await vscode.workspace.findFiles(`**/${message.file}`);
              for (const file of files) {
                const ext = file.fsPath.split('.').pop()?.toLowerCase();

                if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) {
                  const imgData = await vscode.workspace.fs.readFile(file);
                  imageBase64 = Buffer.from(imgData).toString('base64');
                } else {
                  const doc = await vscode.workspace.openTextDocument(file);
                  contextText += `\n\nFile: ${file.fsPath}\n${doc.getText()}`;
                }
              }
            } else {
              // No @file mentioned – use active file
              const editor = vscode.window.activeTextEditor;
              if (editor) {
                const doc = editor.document;
                contextText += `\n\nActive File: ${doc.fileName}\n${doc.getText()}`;
              }
            }

            const aiResponse = await callGeminiAPI(message.prompt, contextText, imageBase64);
            panel.webview.postMessage({ command: 'aiResponse', text: aiResponse });
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

export function deactivate() {}
