const priorityLabel = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function TaskCard({ task, onClick, onEdit, onDelete }) {
  const priorityClass = `priority-${task.priority}`;

  const handleDragStart = (event) => {
    event.dataTransfer.setData('taskId', String(task.id));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <article className="task-card" draggable onDragStart={handleDragStart} onClick={onClick}>
      <div className="task-priority">
        <span className={`priority-badge ${priorityClass}`}>{priorityLabel[task.priority]}</span>
      </div>
      <div className="task-title">{task.title}</div>
      {task.desc ? <div className="task-desc">{task.desc}</div> : null}
      <div className="task-footer">
        <span className="task-tag">{task.tag || 'General'}</span>
        <div className="task-actions">
          <button type="button" className="task-action-btn" onClick={(event) => { event.stopPropagation(); onEdit(); }} title="Chỉnh sửa">
            ✏️
          </button>
          <button type="button" className="task-action-btn delete" onClick={(event) => { event.stopPropagation(); onDelete(); }} title="Xóa">
            🗑
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
