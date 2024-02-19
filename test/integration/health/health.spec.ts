import { ApiServer, defaultServerOptions } from '../../../src/server';
import { getTestServerUrl } from '../integration-test-utils';

const PORT = 8084;

describe('/api/health', () => {
  let server: ApiServer;

  beforeAll(async () => {
    server = new ApiServer({ ...defaultServerOptions, port: PORT });
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('GET', async () => {
    const response = await fetch(getTestServerUrl('/api/health', PORT).href);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('hello!');
  });
});
