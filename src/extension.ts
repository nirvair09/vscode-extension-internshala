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
  
  if (message.file) {
    const files = await vscode.workspace.findFiles(`**/${message.file}`);
    for (const file of files) {
      const doc = await vscode.workspace.openTextDocument(file);
      contextText += `\n\nFile: ${file.path}\n${doc.getText()}`;
    }
  } else {
    const files = await vscode.workspace.findFiles('**/*.{ts,js,cpp,py,txt}', '**/node_modules/**', 5);
    for (const file of files) {
      const doc = await vscode.workspace.openTextDocument(file);
      contextText += `\n\nFile: ${file.path}\n${doc.getText()}`;
    }
  }

  const aiResponse = await callGeminiAPI(message.prompt, contextText);
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
