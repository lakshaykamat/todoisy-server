import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
// Define log formats
const { combine, timestamp, printf, colorize, errors } = format;
// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});
// Create a logger instance
const logger = createLogger({
    level: "info", // Default log level
    format: combine(timestamp(), errors({ stack: true }), // Capture stack trace
    logFormat),
    transports: [
        new transports.Console({
            format: combine(colorize(), timestamp(), logFormat),
        }),
        new transports.DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d", // Keep logs for 14 days
            format: combine(timestamp(), logFormat),
        }),
    ],
    exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
    rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});
export default logger;
//# sourceMappingURL=logger.js.map