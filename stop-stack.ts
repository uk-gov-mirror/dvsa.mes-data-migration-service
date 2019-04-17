import { stopSlsOffline } from './spec/helpers/integration-test-lifecycle';
import { readFileSync, unlinkSync } from 'fs';
import * as compose from 'docker-compose';

const pid = readFileSync('.sls.pid').toString();
stopSlsOffline(Number.parseInt(pid, 10));
unlinkSync('.sls.pid');
compose.down({ cwd: 'e2e' });
