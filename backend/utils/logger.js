const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'app.log');

const logger = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}\n`;

  console.log(logMessage.trim()); // Also log to console

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

module.exports = logger;