import { ApiServer, defaultServerOptions } from '../../src/server';
import { getTestServerUrl } from './integration-test-utils';

describe('/health', () => {
  let server: ApiServer;

  beforeAll(async () => {
    server = new ApiServer(defaultServerOptions);
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('GET', async () => {
    const response = await fetch(getTestServerUrl('/api/health').href);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('hello!');
  });
});
