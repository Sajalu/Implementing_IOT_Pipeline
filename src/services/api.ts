// src/services/api.ts

/**
 * API service for handling requests to the backend
 */

// Base URLs for different APIs
const LOGIN_API_BASE = '/api/v1';
const SENSOR_API_BASE = '/api/sensors';

/**
 * Make authenticated API request
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Promise with response data
 */
const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API error:', errorText);
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
};

/**
 * API functions for sensors
 */
export const sensorApi = {
  /**
   * Get sensor data
   * @returns Promise with sensor data
   */
  getData: async () => {
    try {
      return await authenticatedRequest(`${SENSOR_API_BASE}/data`);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  },
  
  /**
   * Send sensor data
   * @param data - Sensor data to send
   * @returns Promise with response
   */
  sendData: async (data: any) => {
    try {
      return await authenticatedRequest(`${SENSOR_API_BASE}/data`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error sending sensor data:', error);
      throw error;
    }
  }
};

/**
 * API functions for authentication
 */
export const authApi = {
  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @returns Promise with login response
   */
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${LOGIN_API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register user
   * @param username - Username
   * @param email - Email
   * @param password - Password
   * @returns Promise with registration response
   */
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${LOGIN_API_BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};
