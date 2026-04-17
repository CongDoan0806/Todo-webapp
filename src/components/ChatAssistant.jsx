import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { chatService, todoService } from '../services/api.js';

const suggestions = [
  'Tôi còn task nào chưa làm?',
  'Tạo task học React cho tôi',
  'Tổng quan công việc hôm nay?',
];

const ACTION_LABELS = {
  create_todo: 'Tạo todo mới',
  update_todo: 'Cập nhật todo',
  delete_todo: 'Xóa todo',
};

function ChatAssistant({ tasks, columns, onRefreshTodos }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [executing, setExecuting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      setMessages([
        { id: Date.now(), role: 'ai', text: 'Xin chào! Tôi là TaskFlow AI 🤖\nTôi có thể giúp bạn quản lý công việc. Hãy hỏi tôi bất cứ điều gì!' },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingAction]);

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
      if (response.suggested_action) {
        setPendingAction(response.suggested_action);
      }
    } catch (error) {
      const errorMessage = { id: Date.now() + 1, role: 'ai', text: 'Lỗi: ' + error.message };
      setMessages((current) => [...current, errorMessage]);
    }
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    setExecuting(true);
    try {
      const { action, todo_id, payload } = pendingAction;
      if (action === 'create_todo') {
        await todoService.createTodo(payload);
      } else if (action === 'update_todo') {
        await todoService.updateTodo(todo_id, payload);
      } else if (action === 'delete_todo') {
        await todoService.deleteTodo(todo_id);
      }
      await onRefreshTodos();
      const doneMsg = { id: Date.now(), role: 'ai', text: '✅ Đã thực hiện xong!' };
      setMessages((current) => [...current, doneMsg]);
    } catch (error) {
      const errMsg = { id: Date.now(), role: 'ai', text: 'Lỗi khi thực hiện: ' + error.message };
      setMessages((current) => [...current, errMsg]);
    } finally {
      setPendingAction(null);
      setExecuting(false);
    }
  };

  const sendSuggestion = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput('');
    const userMessage = { id: Date.now(), role: 'user', text: trimmed };
    setMessages((current) => [...current, userMessage]);
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
            {pendingAction && (
              <div className="chat-confirm-card">
                <div className="confirm-title">{ACTION_LABELS[pendingAction.action] || pendingAction.action}</div>
                <div className="confirm-body">
                  &ldquo;{pendingAction.payload?.title || `Todo #${pendingAction.todo_id}`}&rdquo;
                </div>
                <div className="confirm-actions">
                  <button type="button" className="btn-confirm-yes" onClick={executeAction} disabled={executing}>
                    {executing ? '...' : 'Có'}
                  </button>
                  <button type="button" className="btn-confirm-no" onClick={() => setPendingAction(null)} disabled={executing}>
                    Không
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
  onRefreshTodos: PropTypes.func.isRequired,
};

export default ChatAssistant;
