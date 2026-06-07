type LogLevel = 'DEBUG' | 'INFO' | 'ERROR';

function log(level: LogLevel, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const entry = `[${level}] ${timestamp} — ${message}`;
  if (data !== undefined) {
    if (level === 'ERROR') {
      console.error(entry, data);
    } else {
      console.log(entry, data);
    }
  } else {
    if (level === 'ERROR') {
      console.error(entry);
    } else {
      console.log(entry);
    }
  }
}

const logger = {
  debug: (message: string, data?: unknown) => log('DEBUG', message, data),
  info:  (message: string, data?: unknown) => log('INFO',  message, data),
  error: (message: string, data?: unknown) => log('ERROR', message, data),
};

export default logger;
