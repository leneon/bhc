import { authService } from '@/services/authService';

export const login = async (username, password) => {
  return await authService.login(username, password);
};

export const loginWithGoogle = () => {
  console.warn('Google login not yet implemented');
  return { success: false, error: 'Google login à venir' };
};

export const register = async (name, email, password) => {
  return await authService.register(name, email, password);
};

export const logout = () => {
  authService.logout();
};

export const getCurrentUser = () => {
  return authService.getStoredUser();
};

export const isAuthenticated = () => {
  return authService.isAuthenticated();
};