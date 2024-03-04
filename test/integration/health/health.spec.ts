import { DatabaseSeedNames, runSeedByName } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('/api/health', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.CLEAN_DATABASE);
  });

  test('GET', async () => {
    const response = await fetch(getTestServerUrl('/api/health').href);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('hello!');
  });
});
