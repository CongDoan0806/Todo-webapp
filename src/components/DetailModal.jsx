import { columns } from '../data/initialData.js';

function DetailModal({ task, onClose, onMoveTask, onEditTask, onDeleteTask }) {
  const availableColumns = columns.filter((column) => column.id !== task.col);
  const statusClass = {
    todo: 'status-todo',
    inprogress: 'status-inprogress',
    done: 'status-done',
  }[task.col];

  const taskPriorityClass = `priority-${task.priority}`;

  const clickOutside = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={clickOutside}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Chi tiết Task</div>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <div className="form-label">Trạng thái</div>
            <div className="detail-status-row">
              <span className={`status-chip ${statusClass}`}>{columns.find((col) => col.id === task.col)?.label || task.col}</span>
              <span className={`priority-badge ${taskPriorityClass}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
              {task.tag ? <span className="task-tag">{task.tag}</span> : null}
            </div>
          </div>

          {task.desc ? (
            <div className="form-group">
              <div className="form-label">Mô tả</div>
              <div className="detail-desc">{task.desc}</div>
            </div>
          ) : null}

          <div className="form-group">
            <div className="form-label">Hành động nhanh</div>
            <div className="detail-status-row">
              {availableColumns.map((column) => (
                <button
                  key={column.id}
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onMoveTask(task.id, column.id)}
                >
                  Chuyển sang {column.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={onDeleteTask}>Xóa</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Đóng</button>
          <button type="button" className="btn btn-primary" onClick={onEditTask}>Chỉnh sửa</button>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
