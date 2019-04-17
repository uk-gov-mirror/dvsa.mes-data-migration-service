import { RDS } from 'aws-sdk';

export const defaultIfNotPresent = (value: string | null | undefined, defaultValue: string) => {
  if (!value || value.trim().length === 0) {
    return defaultValue;
  }
  return value;
};

export const throwIfNotPresent = (value: string | null | undefined, configKey: string) => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Configuration item ${configKey} was not provided with a value`);
  }
  return value;
};

export const generateSignerOptions = (hostname: string, username: string): RDS.Signer.SignerOptions => {
  return {
    username,
    hostname,
    port: 3306,
    region: process.env.AWS_REGION,
  };
};

const iamRdsConfigValid = (hostname: string | undefined, username: string | undefined) => {
  const hostnameValid = hostname && hostname.trim().length > 0;
  const usernameValid = username && username.trim().length > 0;
  return hostnameValid && usernameValid;
};

export const tryFetchRdsAccessToken = async (
  hostname: string,
  username: string,
  fallbackEnvvar: string,
): Promise<string> => {
  if (!iamRdsConfigValid(hostname, username)) {
    const envvar = process.env[fallbackEnvvar];
    if (!envvar) {
      throw new Error(`No value for fallback envvar ${fallbackEnvvar} for config`);
    }
    return envvar;
  }

  throwIfNotPresent(hostname, 'tarsReplicateDatabaseHostname');
  throwIfNotPresent(username, 'tarsReplicaDatabaseUsername');

  const signer = new RDS.Signer();
  const signerOptions = generateSignerOptions(hostname, username);
  return new Promise((resolve, reject) => {
    signer.getAuthToken(signerOptions, (err, token) => {
      if (err) {
        throw new Error(`Generating an auth token failed. Error message: ${err.message}`);
      }
      resolve(token);
    });
  });
};
