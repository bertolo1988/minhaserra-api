import moment from 'moment';
import tk from 'timekeeper';
import CONFIG from '../../../src/config';
import { UsersMapper } from '../../../src/controllers/users/users.mapper';
import {
  unverifiedUser,
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

describe('GET /api/users/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.MULTIPLE_USERS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('if id is not valid uuid', async () => {
      const id = 'not-valid-uuid';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyer),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid url parameter 'id': not-valid-uuid`);
    });
  });

  describe('should return 401', () => {
    test('if authorization header is not provided', async () => {
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if authorization header is il formed', async () => {
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer invalid-token',
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if authorization header does not have 2 parts separated by space', async () => {
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: 'Bearerinvalid-token',
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if authorization header is expired', async () => {
      const nowPlusOneMinute = moment().add(1, 'minute');
      const fewHoursAgo = moment().subtract(
        CONFIG.authentication.jwtExpirationHours,
        'hours',
      );
      tk.travel(fewHoursAgo.toDate());
      const expiredAuthorizationHeader =
        getAuthorizationHeader(verifiedUserBuyer);
      tk.travel(nowPlusOneMinute.toDate());
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: expiredAuthorizationHeader,
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Authorization expired`);
    });
  });

  describe('should return 403', () => {
    test('if user is buyer and provides id different than his own', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${unverifiedUser.id}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`You are not allowed to access this resource`);
    });

    test('if user is seller and provides id different than his own', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserSeller),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`You are not allowed to access this resource`);
    });
  });

  describe('should return 200', () => {
    test('if normal verified and active user fetches his own data', async () => {
      const mapUserModelToPresentedUserModelSpy = jest.spyOn(
        UsersMapper,
        'mapUserModelToPresentedUserModel',
      );

      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(mapUserModelToPresentedUserModelSpy).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toMatchObject({
        id: verifiedUserBuyer.id,
        email: verifiedUserBuyer.email,
        role: verifiedUserBuyer.role,
        firstName: verifiedUserBuyer.firstName,
        lastName: verifiedUserBuyer.lastName,
        birthDate: moment(verifiedUserBuyer.birthDate).toISOString(),
        isEmailVerified: verifiedUserBuyer.isEmailVerified,
        termsVersion: 1,
        lastLoginAt: null,
        invoiceName: verifiedUserBuyer.invoiceName,
        invoiceTaxNumber: verifiedUserBuyer.invoiceTaxNumber,
        invoiceAddressId: verifiedUserBuyerAddress1.id,
        shippingAddressId: verifiedUserBuyerAddress1.id,
        createdAt: verifiedUserBuyer.createdAt.toISOString(),
        updatedAt: verifiedUserBuyer.updatedAt.toISOString(),
      });
    });

    test('if admin fetches another user data', async () => {
      const mapUserModelToPresentedUserModelSpy = jest.spyOn(
        UsersMapper,
        'mapUserModelToPresentedUserModel',
      );

      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserAdmin),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(mapUserModelToPresentedUserModelSpy).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toMatchObject({
        id: verifiedUserBuyer.id,
        email: verifiedUserBuyer.email,
        role: verifiedUserBuyer.role,
        firstName: verifiedUserBuyer.firstName,
        lastName: verifiedUserBuyer.lastName,
        isEmailVerified: verifiedUserBuyer.isEmailVerified,
        termsVersion: 1,
        lastLoginAt: null,
        invoiceName: verifiedUserBuyer.invoiceName,
        invoiceTaxNumber: verifiedUserBuyer.invoiceTaxNumber,
        invoiceAddressId: verifiedUserBuyerAddress1.id,
        shippingAddressId: verifiedUserBuyerAddress1.id,
        createdAt: verifiedUserBuyer.createdAt.toISOString(),
        updatedAt: verifiedUserBuyer.updatedAt.toISOString(),
      });
    });

    test('if moderator fetches another user data', async () => {
      const mapUserModelToPresentedUserModelSpy = jest.spyOn(
        UsersMapper,
        'mapUserModelToPresentedUserModel',
      );

      const response = await fetch(
        getTestServerUrl(`/api/users/${verifiedUserBuyer.id}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserModerator),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(mapUserModelToPresentedUserModelSpy).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toMatchObject({
        id: verifiedUserBuyer.id,
        email: verifiedUserBuyer.email,
        role: verifiedUserBuyer.role,
        firstName: verifiedUserBuyer.firstName,
        lastName: verifiedUserBuyer.lastName,
        isEmailVerified: verifiedUserBuyer.isEmailVerified,
        termsVersion: 1,
        lastLoginAt: null,
        invoiceName: verifiedUserBuyer.invoiceName,
        invoiceTaxNumber: verifiedUserBuyer.invoiceTaxNumber,
        invoiceAddressId: verifiedUserBuyerAddress1.id,
        shippingAddressId: verifiedUserBuyerAddress1.id,
        createdAt: verifiedUserBuyer.createdAt.toISOString(),
        updatedAt: verifiedUserBuyer.updatedAt.toISOString(),
      });
    });
  });
});
