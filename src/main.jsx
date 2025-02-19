import { useState } from 'react';
    const openai = require('openai');

    function ChatInterface() {
      const [apiKey, setApiKey] = useState('');
      const [messages, setMessages] = useState([]);
      const [inputMessage, setInputMessage] = useState('');

      const client = new openai.Client({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      async function handleSendMessage() {
        if (!inputMessage.trim()) return;

        // 添加用户消息
        const newMessages = [...messages, { role: 'user', content: inputMessage }];
        setMessages(newMessages);

        try {
          const completion = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: newMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          });

          // 添加ChatGPT回复
          const responseMessage = {
            role: 'assistant',
            content: completion.choices[0].message.content
          };
          setMessages([...newMessages, responseMessage]);
        } catch (error) {
          console.error('Error:', error.message);
        }

        setInputMessage('');
      }

      return (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          minHeight: '100vh'
        }}>
          <h1>OpenAI Chat Robot</h1>
          
          {!apiKey && (
            <div style={{ marginBottom: '20px' }}>
              <label>请输入你的 OpenAI API Key:</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="在此输入你的 OpenAI API Key..."
                style={{
                  width: '100%',
                  padding: '8px',
                  margin: '10px 0'
                }}
              />
              <button
                onClick={() => {
                  if (!apiKey) alert('请先输入API密钥！');
                }}
                disabled={!apiKey}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                开始聊天
              </button>
            </div>
          )}

          {apiKey && (
            <div style={{
              border: '1px solid #ccc',
              padding: '20px',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <h2>聊天记录</h2>
              {messages.map((msg, index) => (
                <div key={index} style={{ margin: '8px 0' }}>
                  <strong>{msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}:</strong>
                  <p style={{ marginLeft: '10px' }}>{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {apiKey && (
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="请输入你的问题..."
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '8px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  disabled: !inputMessage.trim()
                }}
              >
                发送
              </button>
            </div>
          )}
        </div>
      );
    }

    export default ChatInterface;
