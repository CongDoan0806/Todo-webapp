import { useEffect, useState } from 'react';

const priorities = [
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
];

const columns = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

function TaskModal({ mode, task, columnId, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [col, setCol] = useState(columnId);
  const [priority, setPriority] = useState('medium');
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.desc || '');
      setCol(task.col);
      setPriority(task.priority);
      setTag(task.tag || '');
    } else {
      setTitle('');
      setDesc('');
      setCol(columnId || 'todo');
      setPriority('medium');
      setTag('');
    }
    setError('');
  }, [task, columnId]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Tiêu đề là bắt buộc');
      return;
    }

    onSave({
      title: title.trim(),
      desc: desc.trim(),
      col,
      priority,
      tag: tag.trim() || 'General',
    });
  };

  const clickOutside = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={clickOutside}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{mode === 'edit' ? 'Chỉnh Sửa Task' : 'Tạo Task Mới'}</div>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <div className="form-label">Tiêu đề *</div>
            <input className="form-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nhập tiêu đề task..." />
          </div>
          <div className="form-group">
            <div className="form-label">Mô tả</div>
            <textarea className="form-textarea" value={desc} onChange={(event) => setDesc(event.target.value)} placeholder="Mô tả chi tiết công việc..." rows={4} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Cột</div>
              <select className="form-select" value={col} onChange={(event) => setCol(event.target.value)}>
                {columns.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Ưu tiên</div>
              <select className="form-select" value={priority} onChange={(event) => setPriority(event.target.value)}>
                {priorities.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">Tag</div>
            <input className="form-input" value={tag} onChange={(event) => setTag(event.target.value)} placeholder="e.g. Frontend, Backend, Design..." />
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>Lưu Task</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
