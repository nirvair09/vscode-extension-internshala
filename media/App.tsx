import React, { useState, useEffect } from 'react';
const vscode = (window as unknown as typeof globalThis & { acquireVsCodeApi: () => any }).acquireVsCodeApi();

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);

    if (input.includes('@')) {
      const filename = input.match(/@(\S+)/)?.[1];
      vscode.postMessage({ command: 'userPrompt', prompt: input, file: filename });
    } else {
      vscode.postMessage({ command: 'userPrompt', prompt: input });
    }

    setInput('');
  };

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'aiResponse') {
        setMessages(prev => [...prev, { sender: 'ai', text: message.text }]);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            <b>{msg.sender === 'user' ? 'You' : 'AI'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something... (use @filename to attach a file)"
        style={{ width: '80%', marginRight: '0.5rem' }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default App;
