import { UsersRepository } from '../../../src/controllers/users';
import {
  UpdateUserDto,
  UserRole,
} from '../../../src/controllers/users/users.types';
import {
  inactiveUser,
  softDeletedUser,
  verifiedUserAdmin,
  verifiedUserBuyer,
  verifiedUserBuyerAddress1,
  verifiedUserModerator,
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
      const id = 'malformed-id';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
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
      expect(body.message).toBe(`Invalid id: ${id}`);
    });

    test('if attempts to update user with malformed birthdate', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: '1991-01-01T00:00:00.000Z',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `'birthDate' must be a valid date in format YYYY-MM-DD`,
      );
    });

    test('if attempts to update user with malformed birthdate', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: '1991-01-2',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `'birthDate' must be a valid date in format YYYY-MM-DD`,
      );
    });

    test('if attempts to update user with malformed birthdate', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: '01-01-1990',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `'birthDate' must be a valid date in format YYYY-MM-DD`,
      );
    });

    test('if user tries to update his own id', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: 'df8d4677-09dd-41bc-a283-377d502f693e',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update his own role', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: UserRole.ADMIN,
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update email, should use PATCH /users/email', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'aaaaaa@mail.com',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update password, should use POST /password-resets', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: '123123123123asda$',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update isEmailVerified', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isEmailVerified: true,
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update isActive', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isActive: true,
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update isDeleted', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isDeleted: true,
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update passwordHash', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            passwordHash: 'aa',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update passwordSalt', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            passwordSalt: 'aadsaknsd',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update passwordIterations', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            passwordIterations: 123123,
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('if user tries to update his invoice address id with a malformed uuid', async () => {
      const data: UpdateUserDto = {
        invoiceAddressId: 'malformed-uuid',
      };
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`'invoiceAddressId' must be a valid UUID`);
    });

    test('if user tries to update his shipping address id with a malformed uuid', async () => {
      const data: UpdateUserDto = {
        shippingAddressId: 'malformed-uuid',
      };
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`'shippingAddressId' must be a valid UUID`);
    });
  });

  describe('should return 401', () => {
    test('if soft deleted user tries to update his own data, fails at authentication', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${softDeletedUser.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(softDeletedUser),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: 'Tiago',
          }),
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });
  });

  describe('should return 403', () => {
    test('if inactive user tries to update his own data', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${inactiveUser.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(inactiveUser),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: 'Tiago',
          }),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`Forbidden`);
    });

    test('if buyer tries to update other user data', async () => {
      const id = 'dfd1f83c-fe24-42f5-95aa-3be7caebc40e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Tiago',
        }),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`You are not allowed to access this resource`);
    });

    test('if seller tries to update other user data', async () => {
      const id = 'dfd1f83c-fe24-42f5-95aa-3be7caebc40e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'PUT',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserSeller),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Tiago',
        }),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`You are not allowed to access this resource`);
    });
  });

  describe('should return 404', () => {
    test('if user sets his invoice address with an address that does not exist', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'Bruna',
        lastName: 'Franco',
        termsVersion: 5,
        invoiceAddressId: 'be365f3e-06cd-40f7-b56c-3153de790d33',
      };

      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserSeller.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserSeller),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe(`Invoice address not found`);
    });

    test('if user sets his shipping address with an address that does not exist', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'Bruna',
        lastName: 'Franco',
        termsVersion: 5,
        shippingAddressId: 'be365f3e-06cd-40f7-b56c-3153de790d33',
      };

      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserSeller.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserSeller),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe(`Shipping address not found`);
    });
  });

  describe('should return 200', () => {
    test('if user tries to update invoiceTaxNumber with null', async () => {
      const updateData = {
        invoiceTaxNumber: null,
      };
      const updateOneUserByIdSpy = jest.spyOn(
        UsersRepository,
        'updateOneUserById',
      );
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserSeller.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserSeller),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
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
        invoice_tax_number: null,
      });
    });

    test('if active and verified user tries to update his own data', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'Bruna',
        lastName: 'Franco',
        termsVersion: 5,
      };
      const updateOneUserByIdSpy = jest.spyOn(
        UsersRepository,
        'updateOneUserById',
      );
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserSeller.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserSeller),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
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
        terms_version: updateData.termsVersion,
      });
    });

    test('if admin tries to update other user data', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'Bruna',
        lastName: 'Franco',
        termsVersion: 5,
      };
      const updateOneUserByIdSpy = jest.spyOn(
        UsersRepository,
        'updateOneUserById',
      );
      const response = await fetch(
        getTestServerUrl(`/api/users/${inactiveUser.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserAdmin),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe(`User successfully updated`);
      expect(updateOneUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(updateOneUserByIdSpy).toHaveBeenCalledWith(
        inactiveUser.id,
        updateData,
      );
      const updateUserReturnResult =
        await updateOneUserByIdSpy.mock.results[0].value;
      expect(updateUserReturnResult.length).toBe(1);
      expect(updateUserReturnResult[0]).toMatchObject({
        id: inactiveUser.id,
        first_name: updateData.firstName,
        last_name: updateData.lastName,
        terms_version: updateData.termsVersion,
      });
    });

    test('if moderator tries to update other user data', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'Bruna',
        lastName: 'Franco',
        termsVersion: 5,
      };
      const updateOneUserByIdSpy = jest.spyOn(
        UsersRepository,
        'updateOneUserById',
      );
      const response = await fetch(
        getTestServerUrl(`/api/users/${softDeletedUser.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserModerator),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe(`User successfully updated`);
      expect(updateOneUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(updateOneUserByIdSpy).toHaveBeenCalledWith(
        softDeletedUser.id,
        updateData,
      );
      const updateUserReturnResult =
        await updateOneUserByIdSpy.mock.results[0].value;
      expect(updateUserReturnResult.length).toBe(1);
      expect(updateUserReturnResult[0]).toMatchObject({
        id: softDeletedUser.id,
        first_name: updateData.firstName,
        last_name: updateData.lastName,
        terms_version: updateData.termsVersion,
      });
    });

    test('if user correctly sets his invoice, shipping address, company name and tax number', async () => {
      const updateData: UpdateUserDto = {
        invoiceName: 'Google LLC',
        invoiceTaxNumber: '515116022',
        invoiceAddressId: verifiedUserBuyerAddress1.id,
        shippingAddressId: verifiedUserBuyerAddress1.id,
      };
      const updateOneUserByIdSpy = jest.spyOn(
        UsersRepository,
        'updateOneUserById',
      );
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe(`User successfully updated`);
      expect(updateOneUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(updateOneUserByIdSpy).toHaveBeenCalledWith(
        verifiedUserBuyer.id,
        updateData,
      );
      const updateUserReturnResult =
        await updateOneUserByIdSpy.mock.results[0].value;
      expect(updateUserReturnResult.length).toBe(1);
      expect(updateUserReturnResult[0]).toMatchObject({
        id: verifiedUserBuyer.id,
        invoice_name: updateData.invoiceName,
        invoice_tax_number: updateData.invoiceTaxNumber,
        invoice_address_id: updateData.invoiceAddressId,
        shipping_address_id: updateData.shippingAddressId,
      });
    });
  });
});
