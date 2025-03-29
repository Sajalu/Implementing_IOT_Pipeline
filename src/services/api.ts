// src/services/api.ts

/**
 * API service for handling requests to the backend
 */

// Base URLs for different APIs
const API_BASE = '/api';
const LOGIN_API_BASE = `${API_BASE}/v1`;
const SENSOR_API_BASE = `${API_BASE}/sensors`;

// Define types for API responses
export interface SensorData {
  id: number | string;
  device_id: string;
  temperature: number;
  humidity: number;
  door_status: boolean;
  timestamp: string;
  history?: SensorReading[];
}

export interface SensorReading {
  id: number;
  temperature: number;
  humidity: number;
  door_status: boolean;
  timestamp: string;
}

/**
 * Make authenticated API request
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Promise with response data
 */
const authenticatedRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      
      // Handle specific error codes
      if (response.status === 401 || response.status === 403) {
        // Authentication error - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

/**
 * API functions for sensors
 */
export const sensorApi = {
  /**
   * Get sensor data
   * @returns Promise with sensor data
   */
  getData: async (): Promise<SensorData[]> => {
    try {
      const data = await authenticatedRequest(`${SENSOR_API_BASE}/data`);
      console.log('Received sensor data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  },
  
  /**
   * Get history for a specific device
   * @param deviceId - ID of the device
   * @param days - Number of days of history to retrieve
   * @returns Promise with sensor history data
   */
  getHistory: async (deviceId: string, days: number = 7): Promise<SensorReading[]> => {
    try {
      return await authenticatedRequest(`${SENSOR_API_BASE}/history/${deviceId}?days=${days}`);
    } catch (error) {
      console.error(`Error fetching history for device ${deviceId}:`, error);
      throw error;
    }
  },
  
  /**
   * Send sensor data
   * @param data - Sensor data to send
   * @returns Promise with response
   */
  sendData: async (data: Partial<SensorData>): Promise<SensorData> => {
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
  login: async (email: string, password: string): Promise<{token: string, user: any}> => {
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
  register: async (username: string, email: string, password: string): Promise<any> => {
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