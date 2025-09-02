import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    this.api = null;
  }

  initialize() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.status, error.message);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
          console.warn('API endpoint not found');
        } else if (error.response?.status >= 500) {
          console.error('Server error occurred');
        }
        
        return Promise.reject(error);
      }
    );

    return Promise.resolve();
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('Health check failed');
    }
  }

  // City status and control
  async getCityStatus() {
    const response = await this.api.get('/api/city/status');
    return response.data;
  }

  async startSimulation() {
    const response = await this.api.post('/api/city/simulation/start');
    return response.data;
  }

  async stopSimulation() {
    const response = await this.api.post('/api/city/simulation/stop');
    return response.data;
  }

  // Device management
  async getDevices() {
    const response = await this.api.get('/api/city/devices');
    return response.data;
  }

  async getDevicesByType(type) {
    const response = await this.api.get(`/api/city/devices/${type}`);
    return response.data;
  }

  async getDevice(deviceId) {
    const response = await this.api.get(`/api/city/device/${deviceId}`);
    return response.data;
  }

  // Edge nodes
  async getEdgeNodes() {
    const response = await this.api.get('/api/city/edge-nodes');
    return response.data;
  }

  async getEdgeNode(nodeId) {
    const response = await this.api.get(`/api/city/edge-node/${nodeId}`);
    return response.data;
  }

  // Energy statistics
  async getEnergyStats() {
    const response = await this.api.get('/api/city/energy');
    return response.data;
  }

  // Security
  async getSecurityStatus() {
    const response = await this.api.get('/api/city/security');
    return response.data;
  }

  // Emergency alerts
  async getAlerts() {
    const response = await this.api.get('/api/city/alerts');
    return response.data;
  }

  async triggerEmergency(scenario) {
    const response = await this.api.post(`/api/city/emergency/${scenario}`);
    return response.data;
  }

  // Department methods
  async getDepartments() {
    const response = await this.api.get('/api/departments');
    return response.data;
  }

  async getDepartmentData(department) {
    const response = await this.api.get(`/api/departments/${department}`);
    return response.data;
  }

  async getDepartmentDevices(department) {
    const response = await this.api.get(`/api/departments/${department}/devices`);
    return response.data;
  }

  async getDepartmentAlerts(department) {
    const response = await this.api.get(`/api/departments/${department}/alerts`);
    return response.data;
  }

  async clearAlert(alertId) {
    const response = await this.api.delete(`/api/city/alert/${alertId}`);
    return response.data;
  }

  // Analytics
  async getTrafficAnalytics() {
    const response = await this.api.get('/api/city/analytics/traffic');
    return response.data;
  }

  async getPollutionAnalytics() {
    const response = await this.api.get('/api/city/analytics/pollution');
    return response.data;
  }

  async getEnergyAnalytics() {
    const response = await this.api.get('/api/city/analytics/energy');
    return response.data;
  }

  // Utility methods
  async testConnection() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  getBaseURL() {
    return this.baseURL;
  }

  // Error handling helper
  handleApiError(error, context = '') {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    console.error(`API Error ${context}:`, errorMessage);
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
      context
    };
  }
}

// Export singleton instance
const apiService = new ApiService();
export { apiService as ApiService };
export default apiService;
