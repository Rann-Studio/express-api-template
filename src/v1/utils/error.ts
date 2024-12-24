import fs from 'node:fs';
import path from 'node:path';

export class AppError extends Error {
	public originalError: Error | unknown;
	public statusCode: number;
	public error?: Record<string, any>;
	public stackTrace?: string;

	constructor(originalError: Error | unknown, statusCode: number, message: string, error?: Record<string, any>) {
		super(message);

		this.originalError = originalError;
		this.statusCode = statusCode;
		this.error = error;

		// Include stack trace only in development environment
		if (process.env.NODE_ENV === 'development') {
			this.stackTrace = this.stack;
		}

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class RequestException extends Error {
	public statusCode: number;
	public error?: Record<string, any>;

	constructor(statusCode: number, message: string, error?: Record<string, any>) {
		super(message);
		this.statusCode = statusCode;
		this.error = error;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export const logErrorToFile = (error: Error | unknown) => {
	const date = new Date();
	const formattedDate = date.toISOString().split('T')[0];
	const logFileName = `error-${formattedDate}.log`;
	const logFilePath = path.resolve('logs', logFileName);

	const logMessage = `[${date.toISOString()}] ${error}\n\n`;

	try {
		fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
		fs.appendFileSync(logFilePath, logMessage);
	} catch (fileError) {
		console.error('Failed to write error to log file', fileError);
	}
};
