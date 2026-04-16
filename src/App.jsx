import { useEffect, useMemo, useState } from 'react';
import Board from './components/Board.jsx';
import DetailModal from './components/DetailModal.jsx';
import TaskModal from './components/TaskModal.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';
import AuthPage from './components/AuthPage.jsx';
import { columns, initialTasks } from './data/initialData.js';
import { authService, todoService } from './services/api.js';

const mapBackendTodoToTask = (todo) => ({
  id: todo.id,
  title: todo.title,
  desc: todo.description || '',
  col: todo.col || (todo.is_completed ? 'done' : 'todo'),
  priority: todo.priority || 'medium',
  tag: todo.tag || 'Task',
  dueDate: todo.due_date,
  startDate: todo.start_date,
});

const mapBackendTodosToTasks = (todos) => todos.map((todo) => mapBackendTodoToTask(todo));

const mapTaskToBackendTodo = (task) => ({
  title: task.title,
  description: task.desc,
  is_completed: task.col === 'done',
  col: task.col,
  priority: task.priority,
  tag: task.tag,
  due_date: task.dueDate,
  start_date: task.startDate,
});

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState({ open: false, mode: 'create', task: null, columnId: 'todo' });
  const [detailTaskId, setDetailTaskId] = useState(null);
  const [toast, setToast] = useState('');

  // Khởi tạo: check token và load user từ API
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('taskflow_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        const todos = await todoService.getTodos();
        const mappedTasks = mapBackendTodosToTasks(todos);
        setTasks(mappedTasks);
      } catch (error) {
        console.error('Auth init error:', error);
        localStorage.removeItem('taskflow_token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('taskflow_token', response.access_token);
      
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      
      const todos = await todoService.getTodos();
      const mappedTasks = mapBackendTodosToTasks(todos);
      setTasks(mappedTasks);
      
      setToast(`Chào ${user.username}, bạn đã đăng nhập!`);
      return null;
    } catch (error) {
      return error.message;
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      await authService.register(email, username, password);
      
      const response = await authService.login(email, password);
      localStorage.setItem('taskflow_token', response.access_token);
      
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      setTasks(initialTasks);
      
      setToast('Đăng ký thành công!');
      return null;
    } catch (error) {
      return error.message;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setTasks(initialTasks);
    setDetailTaskId(null);
    setTaskModal({ open: false, mode: 'create', task: null, columnId: 'todo' });
    setToast('Bạn đã đăng xuất.');
  };

  const tasksByColumn = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.col === column.id);
      return acc;
    }, {});
  }, [tasks]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = globalThis.setTimeout(() => setToast(''), 2600);
    return () => globalThis.clearTimeout(timer);
  }, [toast]);

  const handleCreateOpen = (columnId = 'todo') => {
    setTaskModal({ open: true, mode: 'create', task: null, columnId });
  };

  const handleEditOpen = (task) => {
    setTaskModal({ open: true, mode: 'edit', task, columnId: task.col });
  };

  const handleDetailOpen = (taskId) => {
    setDetailTaskId(taskId);
  };

  const handleModalClose = () => {
    setTaskModal((current) => ({ ...current, open: false }));
  };

  const handleDetailClose = () => {
    setDetailTaskId(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskModal.mode === 'edit' && taskModal.task) {
        const backendData = mapTaskToBackendTodo(taskData);
        await todoService.updateTodo(taskModal.task.id, backendData);
        setTasks((current) =>
          current.map((task) => (task.id === taskModal.task.id ? { ...task, ...taskData } : task))
        );
        setToast('Cập nhật task thành công!');
      } else {
        const backendData = mapTaskToBackendTodo(taskData);
        const newTodo = await todoService.createTodo(backendData);
        const newTask = mapBackendTodoToTask(newTodo);
        setTasks((current) => [...current, newTask]);
        setToast('Tạo task mới thành công!');
      }
      handleModalClose();
    } catch (error) {
      setToast('Lỗi: ' + error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await todoService.deleteTodo(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      setToast('Đã xóa task.');
      if (detailTaskId === taskId) handleDetailClose();
    } catch (error) {
      setToast('Lỗi: ' + error.message);
    }
  };

  const handleMoveTask = async (taskId, columnId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const backendData = mapTaskToBackendTodo({ ...task, col: columnId });
      await todoService.updateTodo(taskId, backendData);

      setTasks((current) =>
        current.map((t) => (t.id === taskId ? { ...t, col: columnId } : t))
      );
      setToast(`Đã chuyển task sang ${columns.find((col) => col.id === columnId)?.label || columnId}`);
    } catch (error) {
      setToast('Lỗi: ' + error.message);
    }
  };

  const handleDrop = (taskId, columnId) => {
    handleMoveTask(taskId, columnId);
  };

  const detailTask = tasks.find((task) => task.id === detailTaskId) ?? null;

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p>Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const userInitials = currentUser.username
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo-group">
          <div className="logo-icon">T</div>
          <div className="logo-text">Task<span>Flow</span> AI</div>
        </div>
        <nav className="app-nav">
          {['Dashboard', 'My Tasks', 'Team', 'Reports'].map((label) => (
            <button type="button" key={label} className={label === 'Dashboard' ? 'active' : ''}>
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="btn-new" onClick={() => handleCreateOpen()}>
            <span className="btn-new-icon">+</span> New Task
          </button>
          <div className="header-user">
            <div className="avatar">{userInitials}</div>
            <div className="user-info">
              <div className="user-name">{currentUser.username}</div>
              <button type="button" className="btn btn-ghost logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="board-wrapper">
        <section className="board-header">
          <h1 className="board-title">🚀 Project Alpha</h1>
          <p className="board-subtitle">4 members · Sprint 3 · Updated just now</p>
        </section>
        <Board
          columns={columns}
          tasksByColumn={tasksByColumn}
          onAddTask={handleCreateOpen}
          onTaskClick={handleDetailOpen}
          onEditTask={handleEditOpen}
          onDeleteTask={handleDeleteTask}
          onDropTask={handleDrop}
        />
      </main>

      {taskModal.open && (
        <TaskModal
          mode={taskModal.mode}
          task={taskModal.task}
          columnId={taskModal.columnId}
          onClose={handleModalClose}
          onSave={handleSaveTask}
        />
      )}

      {detailTask && (
        <DetailModal
          task={detailTask}
          columns={columns}
          onClose={handleDetailClose}
          onMoveTask={handleMoveTask}
          onEditTask={() => {
            handleEditOpen(detailTask);
            handleDetailClose();
          }}
          onDeleteTask={() => handleDeleteTask(detailTask.id)}
        />
      )}

      <ChatAssistant tasks={tasks} columns={columns} />

      {toast && <div className="toast-notice">{toast}</div>}
    </div>
  );
}

export default App;
