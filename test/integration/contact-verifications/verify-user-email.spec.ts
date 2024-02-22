import { ApiServer, defaultServerOptions } from '../../../src/server';
import { truncateAllTables } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';

const PORT = 8086;

describe('GET /api/contact-verifications/:id/verify', () => {
  let server: ApiServer;

  beforeAll(async () => {
    server = new ApiServer({ ...defaultServerOptions, port: PORT });
    await server.start();
    await truncateAllTables();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('should return 400 because the passed id is not a valid uuid', async () => {
    const contactVerificationId = 'invalid-uuid';
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${contactVerificationId}/verify`,
        PORT,
      ).href,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe(`Invalid id: ${contactVerificationId}`);
  });

  test('should return 404 if verification does not exist', async () => {
    const contactVerificationId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${contactVerificationId}/verify`,
        PORT,
      ).href,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response.status).toBe(404);
  });

  test.skip('should fail to verify the user email because the verification is expired', async () => {
    // TODO
  });

  test.skip('should successfully verify the user email', async () => {
    // TODO
  });
});
