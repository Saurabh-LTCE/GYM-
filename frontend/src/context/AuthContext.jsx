import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: 'gym_token',
  user: 'gym_user',
  profile: 'gym_profile',
};

const parseJson = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (_) {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token) || '');
  const [user, setUser] = useState(() => parseJson(localStorage.getItem(STORAGE_KEYS.user)));
  const [profile, setProfile] = useState(() =>
    parseJson(localStorage.getItem(STORAGE_KEYS.profile))
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.profile);
    setToken('');
    setUser(null);
    setProfile(null);
    setProfileError('');
  }, []);

  const saveAuth = useCallback((nextToken, nextUser, nextProfile = null) => {
    if (nextToken) {
      localStorage.setItem(STORAGE_KEYS.token, nextToken);
    }
    if (nextUser) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    }
    if (nextProfile) {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(nextProfile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.profile);
    }

    setToken(nextToken || '');
    setUser(nextUser || null);
    setProfile(nextProfile || null);
    setProfileError('');
  }, []);

  const loadProfile = useCallback(
    async (sourceUser = user) => {
      if (!sourceUser?.role || !sourceUser?.profileId) {
        return null;
      }

      setProfileLoading(true);
      setProfileError('');
      try {
        let nextProfile;
        if (sourceUser.role === 'member') {
          nextProfile = await authService.getMemberById(sourceUser.profileId);
        } else if (sourceUser.role === 'trainer') {
          nextProfile = await authService.getTrainerById(sourceUser.profileId);
        } else {
          nextProfile = null;
        }

        if (nextProfile) {
          localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(nextProfile));
          setProfile(nextProfile);
        }
        return nextProfile;
      } catch (error) {
        setProfileError(
          error?.response?.data?.message || error?.message || 'Could not load profile.'
        );
        throw error;
      } finally {
        setProfileLoading(false);
      }
    },
    [user]
  );

  const loginWithBackendData = useCallback(
    async ({ token: nextToken, user: nextUser, profile: nextProfile }) => {
      saveAuth(nextToken, nextUser, nextProfile || null);
      if (!nextProfile && nextUser?.profileId) {
        await loadProfile(nextUser);
      }
    },
    [loadProfile, saveAuth]
  );

  useEffect(() => {
    if (!token || !user?.profileId || profile) return;
    loadProfile(user).catch(() => {});
  }, [token, user, profile, loadProfile]);

  const value = useMemo(
    () => ({
      token,
      user,
      profile,
      isAuthenticated: Boolean(token && user),
      profileLoading,
      profileError,
      saveAuth,
      clearAuth,
      loadProfile,
      loginWithBackendData,
    }),
    [
      token,
      user,
      profile,
      profileLoading,
      profileError,
      saveAuth,
      clearAuth,
      loadProfile,
      loginWithBackendData,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
