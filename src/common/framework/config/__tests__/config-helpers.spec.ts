import { generateSignerOptions } from '../config-helpers';

const AWS = require('aws-sdk');

describe('config helper: generateSignerOptions', () => {
  afterEach(() => {
    delete process.env.AWS_REGION;
  });

  it('should return correct signer options with the given hostname and username', async () => {
    const hostname = 'hostname string of the cluster';
    const username = 'username to connect as';
    process.env.AWS_REGION = 'TEST';
    const port = 3306;

    const result = generateSignerOptions(hostname, username);

    expect(result.region).toBe(process.env.AWS_REGION);
    expect(result.hostname).toBe(hostname);
    expect(result.port).toBe(port);
    expect(result.username).toBe(username);
  });
});
