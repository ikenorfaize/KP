// Utility untuk cek status API dan menampilkan info ke user
class ApiStatusChecker {
  constructor() {
    this.serverStatus = 'checking';
    this.apiMode = 'unknown';
    this.statusElement = null;
  }

  // Check if JSON Server is running
  async checkServerStatus() {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'GET',
        timeout: 2000
      });
      
      if (response.ok) {
        this.serverStatus = 'online';
        this.apiMode = 'json-server';
        return true;
      }
    } catch (error) {
      this.serverStatus = 'offline';
      this.apiMode = 'localStorage';
      return false;
    }
    return false;
  }

  // Create status indicator component
  createStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'api-status-indicator';
    indicator.innerHTML = this.getStatusHTML();
    return indicator;
  }

  getStatusHTML() {
    if (this.serverStatus === 'checking') {
      return `
        <div class="status-badge checking">
          🔄 Checking API Server...
        </div>
      `;
    }
    
    if (this.serverStatus === 'online') {
      return `
        <div class="status-badge online">
          ✅ JSON Server Active (Demo Mode)
          <small>Data will be saved to API</small>
        </div>
      `;
    }
    
    return `
      <div class="status-badge offline">
        ⚠️ Using Browser Storage (Demo Mode)
        <small>Install JSON Server for full API demo</small>
      </div>
    `;
  }

  // Show status notification
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.api-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `api-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Initialize API status checking
  async init() {
    const isOnline = await this.checkServerStatus();
    
    if (!isOnline) {
      this.showNotification(
        '💡 JSON Server not detected. Using browser storage for demo. Run "npm install -g json-server" then "json-server --watch db.json --port 3001" for full API demo.',
        'warning'
      );
    } else {
      this.showNotification(
        '🚀 JSON Server detected! Full API demo mode active.',
        'success'
      );
    }
    
    return { isOnline, mode: this.apiMode };
  }
}

// CSS for status indicators
const statusCSS = `
  .api-status-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .status-badge {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 200px;
  }
  
  .status-badge.checking {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    color: #856404;
  }
  
  .status-badge.online {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
  }
  
  .status-badge.offline {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
  }
  
  .status-badge small {
    margin-top: 4px;
    font-size: 10px;
    opacity: 0.8;
    text-align: center;
  }
  
  .api-notification {
    position: fixed;
    top: 70px;
    right: 20px;
    z-index: 1001;
    max-width: 350px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    animation: slideInRight 0.3s ease-out;
  }
  
  .api-notification.success {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
  }
  
  .api-notification.warning {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    color: #856404;
  }
  
  .api-notification.error {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
  }
  
  .notification-content {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 13px;
    line-height: 1.4;
  }
  
  .notification-content button {
    background: none;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 8px;
    opacity: 0.7;
  }
  
  .notification-content button:hover {
    opacity: 1;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .api-status-indicator,
    .api-notification {
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = statusCSS;
document.head.appendChild(styleSheet);

// Export singleton
export const apiStatusChecker = new ApiStatusChecker();
export default ApiStatusChecker;
