// src/utils/auth.ts

/**
 * Checks if the user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Checks if the current user has the admin role
 * @returns boolean
 */
export const isAdmin = (): boolean => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return false;
    
    const user = JSON.parse(userString);
    return user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Logs the user out by removing auth data from localStorage
 */
export const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/';
};

/**
 * Gets the current authenticated user
 * @returns User object or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
