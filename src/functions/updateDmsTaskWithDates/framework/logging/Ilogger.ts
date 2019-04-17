import { Error } from './error';

export interface ILogger {
  error(error: Error): void;
  warn(message: string): void;
  info(message: string): void;
  debug(message: string): void;
}
