import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { chatService } from '../services/api.js';

const suggestions = [
  'Tôi còn task nào chưa làm?',
  'Tạo task học React cho tôi',
  'Tổng quan công việc hôm nay?',
];

function ChatAssistant({ tasks, columns }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      setMessages([
        { id: Date.now(), role: 'ai', text: 'Xin chào! Tôi là TaskFlow AI 🤖\nTôi có thể giúp bạn quản lý công việc. Hãy hỏi tôi bất cứ điều gì!' },
      ]);
    }
  }, [open, messages.length]);

  const toggleChat = () => {
    setOpen((value) => !value);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { id: Date.now(), role: 'user', text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput('');

    await handleChatResponse(trimmed);
  };

  const handleChatResponse = async (message) => {
    try {
      const response = await chatService.sendMessage(message);
      const aiMessage = { id: Date.now() + 1, role: 'ai', text: response.answer || 'Không có phản hồi từ AI' };
      setMessages((current) => [...current, aiMessage]);
    } catch (error) {
      const errorMessage = { id: Date.now() + 1, role: 'ai', text: 'Lỗi: ' + error.message };
      setMessages((current) => [...current, errorMessage]);
    }
  };

  const sendSuggestion = (text) => {
    setInput(text);
    setTimeout(() => sendSuggestionAsync(text), 10);
  };

  const sendSuggestionAsync = async (message) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMessage = { id: Date.now(), role: 'user', text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    
    await handleChatResponse(trimmed);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button type="button" className="chatbox-btn" onClick={toggleChat} title="AI Assistant">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>
      </button>
      {open && (
        <div className="chatbox-panel">
          <div className="chat-header">
            <div className="chat-ai-icon">🤖</div>
            <div className="chat-header-info">
              <div className="chat-header-name">TaskFlow AI</div>
              <div className="chat-header-status">
                <div className="online-dot" /> Online · Sẵn sàng hỗ trợ
              </div>
            </div>
            <button type="button" className="chat-close" onClick={toggleChat}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-bubble ${message.role}`}>
                <div className="bubble-text">
                  {message.text.split('\n').map((line) => (
                    <span key={line}>{line}<br /></span>
                  ))}
                </div>
                <div className="bubble-time">{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
          <div className="chat-suggestions">
            {suggestions.map((text) => (
              <button key={text} type="button" className="suggestion-btn" onClick={() => sendSuggestion(text)}>{text}</button>
            ))}
          </div>
          <div className="chat-input-area">
            <textarea
              className="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi AI về công việc..."
              rows={1}
            />
            <button type="button" className="chat-send" onClick={sendMessage}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

ChatAssistant.propTypes = {
  tasks: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default ChatAssistant;
