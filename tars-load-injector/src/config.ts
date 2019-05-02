import * as dotenv from 'dotenv';
import * as moment from 'moment';

export interface Config {
  connectionString: string;
  username: string;
  password: string;
  changesPerMinute: number;
  startDate: Date;
}

export const getConfig = (): Config => {
  dotenv.config();
  return {
    connectionString: process.env.CONNECTION_STRING,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    changesPerMinute: getNumberFromEnv('CHANGES_PER_MINUTE') || 60,
    startDate: moment.utc(process.env.START_DATE || '2017-08-03').toDate(),
  };
};

const getNumberFromEnv = (envvar: string): number => {
  const maybeNumber = parseInt(process.env[envvar], 10);
  if (isNaN(maybeNumber)) {
    return null;
  }
  return maybeNumber;
};
