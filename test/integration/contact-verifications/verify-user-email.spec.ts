import { ContactVerificationsRepository } from '../../../src/controllers/contact-verifications';
import { UsersRepository } from '../../../src/controllers/users';
import {
  expiredJohnContactVerification,
  johnContactVerification,
  johnContactVerificationInvalidEmail,
  johnData,
  manuelData,
  manuelUsedContactVerification,
} from '../../seeds/verify-user-email.seed';
import { DatabaseSeedNames, runSeedByName } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /api/contact-verifications/:id/verify', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.VERIFY_USER_EMAIL);
  });

  test('should return 400 because the passed id is not a valid uuid', async () => {
    const contactVerificationId = 'invalid-uuid';
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${contactVerificationId}/verify`,
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
    expect(body.message).toBe(`Invalid url parameter 'id': invalid-uuid`);
  });

  test('should return 404 if verification does not exist', async () => {
    const contactVerificationId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${contactVerificationId}/verify`,
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

  test('should fail to verify the user email because the verification is already used', async () => {
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${manuelUsedContactVerification.id}/verify`,
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

  test('should fail to verify the user email because the verification is expired', async () => {
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${expiredJohnContactVerification.id}/verify`,
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

  test('should fail to verify the user email because the contact verification has the wrong email address', async () => {
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${johnContactVerificationInvalidEmail.id}/verify`,
      ).href,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.message).toBe(
      `Failed to set email verified in user with id ${johnContactVerificationInvalidEmail.id} and email ${johnContactVerificationInvalidEmail.contact}`,
    );
  });

  test('should successfully verify the user email', async () => {
    const response = await fetch(
      getTestServerUrl(
        `/api/contact-verifications/${johnContactVerification.id}/verify`,
      ).href,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toBe(
      `Successfully verified email ${johnContactVerification.contact}`,
    );

    const contactVerification = await ContactVerificationsRepository.getById(
      johnContactVerification.id,
    );
    expect(contactVerification?.verifiedAt).not.toBeNull();

    const user = await UsersRepository.getById(johnData.id);
    expect(user?.isEmailVerified).toBe(true);
  });
});
