import exp from 'constants';
import EmailService from '../../../src/controllers/emails/email-service';
import { userData } from '../../seeds/create-password-reset.seed';
import { DatabaseSeedNames, runSeedByName } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('POST /api/password-resets', () => {
  let sendEmailSpy: jest.SpyInstance;

  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.CREATE_PASSWORD_RESET);

    sendEmailSpy = jest
      .spyOn(EmailService.prototype, 'sendEmail')
      .mockResolvedValue({} as any);
  });

  afterEach(() => {
    sendEmailSpy.mockClear();
  });

  afterAll(() => {
    sendEmailSpy.mockReset();
  });

  describe('returns status 400', () => {
    test('when email is missing', async () => {
      const response = await fetch(
        getTestServerUrl('/api/password-resets').href,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must have required property 'email'`);
    });
  });

  describe('returns status 200', () => {
    test('when email exists', async () => {
      const response = await fetch(
        getTestServerUrl('/api/password-resets').href,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
          }),
        },
      );
      expect(sendEmailSpy).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe('Password reset link sent');
    });

    test('when email does not exist', async () => {
      const response = await fetch(
        getTestServerUrl('/api/password-resets').href,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'does-not-exist@mail.com',
          }),
        },
      );
      expect(sendEmailSpy).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe('Password reset link sent');
    });
  });
});
