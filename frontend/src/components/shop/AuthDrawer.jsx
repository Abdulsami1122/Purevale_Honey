import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../../admin/AdminAuthContext';
import './AuthDrawer.css';

const AuthDrawer = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Shared State
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [busy, setBusy] = useState(false);
  
  const navigate = useNavigate();
  const { login: adminLogin } = useAdminAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setBusy(true);
    try {
      // 1. Try Customer Login
      const res = await api.customerLogin(email.trim(), password);
      localStorage.setItem('dh_customer_token', res.token);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onClose(); 
      }, 1500);
    } catch (custErr) {
      // 2. If Customer Login fails, try Admin Login
      if (custErr.status === 401 || custErr.message.toLowerCase().includes('invalid')) {
        try {
          await adminLogin(email.trim(), password);
          setSuccessMsg('Logged in as Admin!');
          setTimeout(() => {
            onClose();
            navigate('/admin');
          }, 1500);
        } catch (adminErr) {
          setError('Invalid email or password');
        }
      } else {
        setError(custErr.message || 'Login failed');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setBusy(true);
    try {
      const res = await api.customerRegister(firstName.trim(), lastName.trim(), regEmail.trim(), regPassword);
      localStorage.setItem('dh_customer_token', res.token);
      setSuccessMsg('Registered successfully!');
      setTimeout(() => {
        onClose(); 
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('auth-drawer-open');
      document.documentElement.classList.add('auth-drawer-open');
    } else {
      document.body.classList.remove('auth-drawer-open');
      document.documentElement.classList.remove('auth-drawer-open');
      // Reset state when closing
      setError('');
      setSuccessMsg('');
      setPassword('');
      setRegPassword('');
    }
    return () => {
      document.body.classList.remove('auth-drawer-open');
      document.documentElement.classList.remove('auth-drawer-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMode = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
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
          {error && <div style={{ color: '#d9534f', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
          {successMsg && <div style={{ color: '#5cb85c', marginBottom: '15px', fontWeight: 'bold' }}>{successMsg}</div>}
          
          {mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group custom-placeholder">
                <input 
                  type="email" 
                  placeholder=" " 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <label>Email <span className="req">*</span></label>
              </div>
              <div className="form-group custom-placeholder">
                <input 
                  type="password" 
                  placeholder=" " 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <label>Password <span className="req">*</span></label>
              </div>

              <div className="form-links">
                <a href="#forgot" className="auth-link">Forgot your password?</a>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={busy}>
                {busy ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="form-links">
                <a href="#register" className="auth-link" onClick={toggleMode}>
                  New customer? Create your account
                </a>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-group custom-placeholder">
                <input 
                  type="text" 
                  placeholder=" " 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
                <label>First Name</label>
              </div>
              <div className="form-group custom-placeholder">
                <input 
                  type="text" 
                  placeholder=" " 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
                <label>Last Name</label>
              </div>
              <div className="form-group custom-placeholder">
                <input 
                  type="email" 
                  placeholder=" " 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required 
                />
                <label>Email <span className="req">*</span></label>
              </div>
              <div className="form-group custom-placeholder">
                <input 
                  type="password" 
                  placeholder=" " 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required 
                />
                <label>Password <span className="req">*</span></label>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={busy}>
                {busy ? 'Registering...' : 'Register'}
              </button>

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
