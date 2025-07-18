import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const ApiStatusIndicator = () => {
  const [status, setStatus] = useState({
    mode: 'checking',
    userCount: 0,
    lastUser: null
  });

  useEffect(() => {
    checkApiStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    try {
      // Initialize API service
      await apiService.init();
      
      // Get user count for demo
      if (apiService.USE_JSON_SERVER) {
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        const lastUser = users[users.length - 1];
        
        setStatus({
          mode: 'json-server',
          userCount: users.length,
          lastUser: lastUser?.fullName || 'None'
        });
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const lastUser = users[users.length - 1];
        
        setStatus({
          mode: 'localStorage',
          userCount: users.length,
          lastUser: lastUser?.fullName || 'None'
        });
      }
    } catch (error) {
      setStatus({
        mode: 'error',
        userCount: 0,
        lastUser: null
      });
    }
  };

  const getStatusIcon = () => {
    switch (status.mode) {
      case 'json-server': return '🚀';
      case 'localStorage': return '💾';
      case 'checking': return '⏳';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = () => {
    switch (status.mode) {
      case 'json-server': return 'API Server';
      case 'localStorage': return 'Browser Storage';
      case 'checking': return 'Checking...';
      case 'error': return 'API Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="api-status-indicator-compact" title={`Demo Mode: ${getStatusText()}\nUsers: ${status.userCount}\nLast User: ${status.lastUser}`}>
      <span className="status-icon">{getStatusIcon()}</span>
      <span className="status-text">{getStatusText()}</span>
      <span className="status-count">{status.userCount}</span>
    </div>
  );
};

export default ApiStatusIndicator;
