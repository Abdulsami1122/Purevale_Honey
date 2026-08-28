import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AuthDrawer.css';

const AuthDrawer = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('auth-drawer-open');
    } else {
      document.body.classList.remove('auth-drawer-open');
    }
    return () => {
      document.body.classList.remove('auth-drawer-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMode = (e) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <>
      <div className="auth-backdrop" onClick={onClose}></div>
      <div className={`auth-drawer ${isOpen ? 'is-open' : ''}`}>
        <div className="auth-drawer-header">
          <h2>{mode === 'login' ? 'LOGIN' : 'REGISTER'}</h2>
          <button type="button" className="auth-drawer-close" onClick={onClose} aria-label="Close">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="auth-drawer-body">
          {mode === 'login' ? (
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group custom-placeholder">
                <input type="email" placeholder=" " required />
                <label>Email <span className="req">*</span></label>
              </div>
              <div className="form-group custom-placeholder">
                <input type="password" placeholder=" " required />
                <label>Password <span className="req">*</span></label>
              </div>

              <div className="form-links">
                <a href="#forgot" className="auth-link">Forgot your password?</a>
              </div>

              <button type="submit" className="auth-submit-btn">Sign In</button>

              <div className="form-links">
                <a href="#register" className="auth-link" onClick={toggleMode}>
                  New customer? Create your account
                </a>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group custom-placeholder">
                <input type="text" placeholder=" " required />
                <label>First Name</label>
              </div>
              <div className="form-group custom-placeholder">
                <input type="text" placeholder=" " required />
                <label>Last Name</label>
              </div>
              <div className="form-group custom-placeholder">
                <input type="email" placeholder=" " required />
                <label>Email <span className="req">*</span></label>
              </div>
              <div className="form-group custom-placeholder">
                <input type="password" placeholder=" " required />
                <label>Password <span className="req">*</span></label>
              </div>

              <button type="submit" className="auth-submit-btn">Register</button>

              <div className="form-links mt-3">
                <a href="#login" className="auth-link" onClick={toggleMode}>
                  Already have an account? Login here
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthDrawer;
