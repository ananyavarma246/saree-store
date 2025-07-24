import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode); // 'login' or 'register'

  if (!isOpen) return null;

  const handleSwitchToLogin = () => setMode('login');
  const handleSwitchToRegister = () => setMode('register');

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="auth-modal-body">
          {mode === 'login' ? (
            <Login 
              onClose={onClose} 
              onSwitchToRegister={handleSwitchToRegister}
            />
          ) : (
            <Register 
              onClose={onClose} 
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
