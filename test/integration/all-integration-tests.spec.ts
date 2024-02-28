import { DatabaseSeedNames, runSeedByName } from '../test-utils';
import TestServerSingleton from './test-server-instance';

describe('Integration tests', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.CLEAN_DATABASE);
  });

  afterAll(async () => {
    (await TestServerSingleton.getInstance()).stop();
  });

  require('./contact-verifications/verify-user-email.spec');
  require('./health/health.spec');
  require('./users/create-user.spec');
  require('./users/login.spec');
});
