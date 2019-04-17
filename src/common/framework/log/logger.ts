/**
 * Wrapper API for logging functions. Should be extracted as a common dependency for all microservices.
 */
import * as moment from 'moment';

/**
 * Logs the specified message prefixed by calculated time duration, in mins:secs:millis.
 * @param start The start of the duration
 * @param end The end of the duration
 * @param message The log message
 */
export const logDuration = (start: Date, end: Date, message: string) => {
  const duration = moment(end).diff(moment(start));
  console.log(`took ${moment.utc(duration).format('mm [mins], ss [secs], SSS [ms]')}: ${message}`);
};
