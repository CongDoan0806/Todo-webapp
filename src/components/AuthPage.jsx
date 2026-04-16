import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/api.js';

function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email và mật khẩu là bắt buộc.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        if (!username.trim()) {
          setError('Username không được để trống.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Mật khẩu xác nhận không khớp.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Mật khẩu phải ít nhất 6 ký tự.');
          setLoading(false);
          return;
        }
        await authService.register(email.trim(), username.trim(), password);
        const result = await onRegister({ username: username.trim(), email: email.trim(), password: password.trim() });
        if (result) {
          setError(result);
        }
      } else {
        const loginResult = await onLogin({ email: email.trim(), password: password.trim() });
        if (loginResult) {
          setError(loginResult);
        }
      }
    } catch (err) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-headline">TaskFlow AI</div>
        <div className="auth-subtitle">Quản lý công việc trực quan và thông minh.</div>

        <div className="auth-toggle">
          <button
            type="button"
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setMode('login')}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setMode('register')}
          >
            Đăng ký
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="username" className="form-label">Tên người dùng</label>
              <input
                id="username"
                className="form-input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Nhập username..."
                autoComplete="username"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Nhập email..."
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Mật khẩu</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu..."
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
              <input
                id="confirmPassword"
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Nhập lại mật khẩu..."
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {getSubmitButtonText(loading, mode)}
          </button>
        </form>

        <p className="auth-note">
          {getToggleText(mode)}
          <button type="button" className="auth-link" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
            {mode === 'register' ? ' Đăng nhập ngay' : ' Đăng ký ngay'}
          </button>
        </p>
      </div>
    </div>
  );
}

AuthPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};

const getSubmitButtonText = (loading, mode) => {
  if (loading) return 'Đang xử lý...';
  return mode === 'register' ? 'Đăng ký tài khoản' : 'Đăng nhập';
};

const getToggleText = (mode) => (mode === 'register' ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?');

export default AuthPage;
