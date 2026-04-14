import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { authService } from '../services/authService';
import '../styles/auth.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M21.81 10.04H12v3.92h5.63c-.25 1.37-1.53 4.03-5.63 4.03-3.39 0-6.15-2.81-6.15-6.27S8.61 5.45 12 5.45c1.93 0 3.22.82 3.96 1.53l2.7-2.61C16.94 2.75 14.7 1.73 12 1.73 6.9 1.73 2.77 5.86 2.77 10.96s4.13 9.23 9.23 9.23c5.32 0 8.84-3.74 8.84-9.01 0-.61-.07-1.07-.16-1.48Z"
      fill="currentColor"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectByRole = (role) => {
    if (role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    if (role === 'trainer') {
      navigate('/trainer', { replace: true });
      return;
    }
    if (role === 'member') {
      navigate('/member', { replace: true });
      return;
    }
    throw new Error('Unsupported role received from backend.');
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const backendData = await authService.googleLogin(idToken);
      const user = backendData?.user ?? backendData;

      if (!user?.role) {
        throw new Error('Role missing in login response.');
      }

      localStorage.setItem('gym_user', JSON.stringify(user));
      redirectByRole(user.role);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Google sign in failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <section className="auth-card">
        <p className="auth-chip">Neobrutal Fitness Suite</p>
        <h1>Gym Management System</h1>
        <p className="auth-subtitle">Welcome back! Manage your fitness journey</p>

        <button
          type="button"
          className="google-login-btn"
          disabled={loading}
          onClick={handleGoogleLogin}
        >
          <span className="google-login-btn__icon">
            <GoogleIcon />
          </span>
          <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}
      </section>
    </div>
  );
};

export default Login;
