export interface Root {
  requestId: string;
  inputMessage: string;
  creationTimestamp: string;
  statusCode: string;
  statusReason: string;
  flowType: string;
  translationDirection: string;
  inputMessageType: any;
  senderBic: string;
  receiverBic: string;
  outputMessage: string;
  outputMessageType: string;
  senderDn: string;
  receiverDn: string;
  events: Event[];
}

export interface Event {
  id: number;
  requestId: string;
  statusCode: string;
  statusReason: string;
  timestamp: string;
  flowType: string;
  translationDirection: string;
}

export enum LogLevel {
  INFO = 'INFO', // Informational messages, typically for tracing or reporting normal operation.
  DEBUG = 'DEBUG', // Debugging details useful for development and troubleshooting.
  WARN = 'WARN', // Warnings indicating potential issues or unexpected situations.
  ERROR = 'ERROR', // Errors that require immediate attention but are not fatal.
  FATAL = 'FATAL', // Critical errors indicating system-wide failure or unhandled exceptions.
}

export enum LogType {
  MESSAGE_SEARCH = 'MESSAGE SEARCH', // Logs related to security events, like unauthorized access or policy violations.
  LOGIN = 'LOGIN', // Logs that record changes, access, or actions for compliance and auditing purposes.
  SYSTEM = 'SYSTEM', // Logs related to system-level events, like server health or configurations.
  APPLICATION = 'APPLICATION', // Logs from the application code, such as function errors or user actions.
  OTHER = 'OTHER', // A generic category for logs that don't fit into predefined types.
}

export interface ApplicationLog {
  logLevel: LogLevel;
  logType: LogType;
  description: string;
  logDate?: string;
}
