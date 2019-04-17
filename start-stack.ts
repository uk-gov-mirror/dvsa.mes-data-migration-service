import { startSlsOffline } from './spec/helpers/integration-test-lifecycle';
import * as compose from 'docker-compose';
const dockerMonitor = require('node-docker-monitor');

process.env.NODE_ENV = 'local';
startSlsOffline().then(() => {
  console.log('Starting MySQL...');
  compose.upAll({ cwd: 'e2e', log: true }).then(() => {
    dockerMonitor({
      onMonitorStarted: () => {},
      onMonitorStopped: () => {},
      onContainerUp: () => {},
      onContainerDown: (container: any) => {
        if (container.Name === 'mes-data-replication-service-e2e-migration') {
          console.log('MySQL migration completed');
          process.exit(0);
        }
      },
    });
  });
});
