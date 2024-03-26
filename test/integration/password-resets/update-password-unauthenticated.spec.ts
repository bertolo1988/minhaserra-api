import {
  expiredPasswordReset,
  passwordResetData,
  usedPasswordReset,
  userData,
} from '../../seeds/update-password-unauthenticated.seed';
import { DatabaseSeedNames, runSeedByName } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('PUT /api/password-resets/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.UPDATE_PASSWORD_UNAUTHENTICATED);
  });

  describe('returns status 404', () => {
    test('when password reset id does not exist', async () => {
      const response = await fetch(
        getTestServerUrl(
          '/api/password-resets/ae91b27b-45be-4c62-a162-9f66bc8acc9b',
        ).href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: passwordResetData.token,
            password: 'Password$155',
          }),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Password reset not found');
    });

    test('when token does not exist', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/password-resets/${passwordResetData.id}`).href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: 'does-not-exist',
            password: 'Password$155',
          }),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Password reset not found');
    });

    test('when password reset is already used', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/password-resets/${usedPasswordReset.id}`).href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: usedPasswordReset.token,
            password: 'Password$155',
          }),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Password reset not found');
    });

    test('when password reset is expired', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/password-resets/${expiredPasswordReset.id}`)
          .href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: expiredPasswordReset.token,
            password: 'Password$155',
          }),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Password reset not found');
    });
  });

  describe('returns status 400', () => {
    test('when password is invalid', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/password-resets/${expiredPasswordReset.id}`)
          .href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: expiredPasswordReset.token,
            password: 'Pa',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `'password' must be have at least 8 characters and at most 64 characters, and must contain at least one uppercase letter, one lowercase letter, one digit, and one special character`,
      );
    });

    test('when token is missing', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/password-resets/${passwordResetData.id}`).href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: 'Password$$123As',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe("must have required property 'token'");
    });

    test('when id is not valid uuid', async () => {
      const invalidId = 'invalid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/password-resets/${invalidId}`).href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: expiredPasswordReset.token,
            password: 'Password$155',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid url parameter 'id': invalid-uuid`);
    });
  });

  describe('returns status 200', () => {
    test('when password is successfully updated, should be able to login afterwards', async () => {
      const newPassword = 'Password$155';
      const response = await fetch(
        getTestServerUrl(`/api/password-resets/${passwordResetData.id}`).href,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: passwordResetData.token,
            password: newPassword,
          }),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe('Password updated');

      const responseLogin = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: newPassword,
        }),
      });
      expect(responseLogin.status).toBe(200);
      const loginBody = await responseLogin.json();
      expect(loginBody.token).toBeDefined();
    });
  });
});
