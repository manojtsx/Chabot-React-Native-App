// API Configuration for different environments
export const API_CONFIG = {
  // Development URLs
  LOCALHOST: 'http://127.0.0.1:5000',
  COMPUTER_IP: 'http://192.168.100.111:5000',
  
  // Production URL (if you deploy your Flask app)
  PRODUCTION: 'https://your-production-domain.com',
};

// Choose the appropriate URL based on your environment
export const getApiUrl = () => {
  // For web development
  if (typeof window !== 'undefined') {
    return API_CONFIG.LOCALHOST;
  }
  
  // For mobile development (Expo)
  return API_CONFIG.COMPUTER_IP;
};

export default getApiUrl(); 