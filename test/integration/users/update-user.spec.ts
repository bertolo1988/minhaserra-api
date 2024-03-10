import { UsersRepository } from '../../../src/controllers/users';
import {
  UpdateUserDto,
  UserRole,
} from '../../../src/controllers/users/users.types';
import {
  inactiveUser,
  softDeletedUser,
  verifiedUserBuyer,
  verifiedUserSeller,
} from '../../seeds/multiple-users.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('PUT /api/users/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.MULTIPLE_USERS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 400', () => {
    test('if user tries to update his own id', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'df8d4677-09dd-41bc-a283-377d502f693e',
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update his own role', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: UserRole.ADMIN,
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update email, should use PATCH /users/email', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'aaaaaa@mail.com',
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update password, should use POST /password-resets', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: '123123123123asda$',
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update isEmailVerified', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isEmailVerified: true,
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update isActive', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: true,
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update isDeleted', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDeleted: true,
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update passwordHash', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwordHash: 'aa',
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update passwordSalt', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwordSalt: 'aadsaknsd',
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update passwordIterations', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwordIterations: 123123,
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });
  });

  describe('should return 401', () => {
    test('if soft deleted user tries to update his own data, fails at authentication', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(softDeletedUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Tiago',
        }),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });
  });

  describe('should return 403', () => {
    test('if inactive user tries to update his own data', async () => {
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(inactiveUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Tiago',
        }),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`Forbidden`);
    });
  });

  describe('should return 200', () => {
    test('if active and verified user tries to update his own data', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'Bruna',
        lastName: 'Franco',
        organizationName: 'Bruna Franco Lda',
        termsVersion: 5,
      };
      const updateOneUserByIdSpy = jest.spyOn(
        UsersRepository,
        'updateOneUserById',
      );
      const response = await fetch(getTestServerUrl(`/api/users`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserSeller),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe(`User successfully updated`);
      expect(updateOneUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(updateOneUserByIdSpy).toHaveBeenCalledWith(
        verifiedUserSeller.id,
        updateData,
      );
      const updateUserReturnResult =
        await updateOneUserByIdSpy.mock.results[0].value;
      expect(updateUserReturnResult.length).toBe(1);
      expect(updateUserReturnResult[0]).toMatchObject({
        id: verifiedUserSeller.id,
        first_name: updateData.firstName,
        last_name: updateData.lastName,
        organization_name: updateData.organizationName,
        terms_version: updateData.termsVersion,
      });
    });
  });
});
