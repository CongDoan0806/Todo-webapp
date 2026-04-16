import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

function Column({ column, tasks, onAddTask, onDropTask, onTaskClick, onEditTask, onDeleteTask }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const taskId = Number(event.dataTransfer.getData('taskId'));
    if (taskId) {
      onDropTask(taskId);
    }
    setDragOver(false);
  };

  return (
    <section className={`column${dragOver ? ' drag-over' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <div className="col-header">
        <div className="col-title-group">
          <div className="col-dot" style={{ background: column.dot }} />
          <div className="col-title">{column.label}</div>
          <div className="col-count">{tasks.length}</div>
        </div>
        <button type="button" className="col-add-btn" onClick={onAddTask} title="Thêm task">
          +
        </button>
      </div>
      <div className="col-body">
        {tasks.length === 0 ? (
          <div className="col-empty">
            <div className="col-empty-icon">📭</div>
            Chưa có task nào
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Column;
