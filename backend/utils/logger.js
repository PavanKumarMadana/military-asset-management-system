const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
const logFilePath = path.join(logsDir, 'app.log');

const logger = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}\n`;

  console.log(logMessage.trim()); // Also log to console

  fs.mkdir(logsDir, { recursive: true }, (dirErr) => {
    if (dirErr) {
      console.error('Failed to create logs directory:', dirErr);
      return;
    }

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  });
};

module.exports = logger;
