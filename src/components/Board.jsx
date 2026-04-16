import Column from './Column.jsx';

function Board({ columns, tasksByColumn, onAddTask, onDropTask, onTaskClick, onEditTask, onDeleteTask }) {
  return (
    <div className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasksByColumn[column.id] ?? []}
          onAddTask={() => onAddTask(column.id)}
          onDropTask={(taskId) => onDropTask(taskId, column.id)}
          onTaskClick={onTaskClick}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}

export default Board;
