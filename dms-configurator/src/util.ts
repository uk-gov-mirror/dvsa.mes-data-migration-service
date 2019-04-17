/**
 * Common utility functionality.
 */
import * as fs from 'fs';
import { createLogger, Logger, format, transports } from 'winston';

/**
 * Get a logger to use.
 *
 * The logger is for the console, includes timestamps, the module name and coloured log levels.
 *
 * @param name      The name of the module
 * @param logLevel  The log level to set (silly, debug, info, warning, error)
 */
export function getLogger(name: string, logLevel: string): Logger {
  const logger = createLogger({
    level: logLevel,
    format: format.combine(
            format.label({ label: name }),
            format.timestamp(),
            format.splat(),
            format.simple(),
        ),
    transports: [new transports.Console()],
  });

  return logger;
}

/**
 * Loads the specified file, and parses to JSON object. Any exceptions are thrown.
 * @param name      The file name
 */
export function loadJSON(name: string): any {
  const resultText = fs.readFileSync(name);
  return JSON.parse(resultText.toString('utf8'));
}
