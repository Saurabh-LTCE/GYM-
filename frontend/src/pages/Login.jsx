import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
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
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getSelectedRole = () => {
    const role = localStorage.getItem('selected_role');
    if (!role) {
      throw new Error('Please select a role before login.');
    }
    return role;
  };

  const redirectByRole = (role) => {
    if (role === 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (role === 'trainer') {
      navigate('/trainer-dashboard', { replace: true });
      return;
    }
    if (role === 'member') {
      navigate('/member-dashboard', { replace: true });
      return;
    }
    throw new Error('Unsupported role received from backend.');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const finalizeBackendLogin = async (firebaseUser, fallbackName = '') => {
    const role = getSelectedRole();
    const payload = {
      name:
        firebaseUser.displayName ||
        fallbackName ||
        firebaseUser.email?.split('@')[0] ||
        'Gym User',
      email: firebaseUser.email,
      uid: firebaseUser.uid,
      role,
    };

    const backendData = await authService.firebaseLogin(payload);
    const token = backendData?.token;
    const user = backendData?.user;

    if (!token || !user?.role) {
      throw new Error('Invalid response from backend auth API.');
    }

    localStorage.setItem('gym_token', token);
    localStorage.setItem('gym_user', JSON.stringify(user));
    redirectByRole(user.role.toLowerCase());
  };

  const withAuthHandler = async (authAction, genericMessage) => {
    setErrorMessage('');
    setLoading(true);
    try {
      await authAction();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || error?.message || genericMessage
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await withAuthHandler(async () => {
      const result = await signInWithPopup(auth, googleProvider);
      await finalizeBackendLogin(result.user);
    }, 'Google sign in failed. Please try again.');
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    await withAuthHandler(async () => {
      const { email, password, name } = formData;
      let credentials;

      if (isSignupMode) {
        credentials = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        credentials = await signInWithEmailAndPassword(auth, email, password);
      }

      await finalizeBackendLogin(credentials.user, name.trim());
    }, 'Email authentication failed. Please try again.');
  };

  return (
    <div className="auth-screen">
      <section className="auth-card">
        <p className="auth-chip">
          Role: {(localStorage.getItem('selected_role') || 'none').toUpperCase()}
        </p>
        <h1>Gym Management System</h1>
        <p className="auth-subtitle">Welcome back! Manage your fitness journey</p>

        <form className="auth-form" onSubmit={handleEmailAuth}>
          {isSignupMode && (
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <button
            type="submit"
            className="google-login-btn auth-primary-btn"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isSignupMode
                ? 'Create Account'
                : 'Login with Email'}
          </button>
        </form>

        <p className="auth-divider">OR</p>
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

        <button
          type="button"
          className="auth-switch-btn"
          onClick={() => setIsSignupMode((prev) => !prev)}
          disabled={loading}
        >
          {isSignupMode ? 'Already have an account? Login' : "Don't have an account? Sign up"}
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
