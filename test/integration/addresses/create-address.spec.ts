import CONSTANTS from '../../../src/constants';
import { AddressesRepository } from '../../../src/controllers/addresses/addresses.repository';
import { CreateAddressDto } from '../../../src/controllers/addresses/addresses.types';
import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedUserAdmin,
} from '../../seeds/multiple-users.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('POST api/addresses', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.MULTIPLE_USERS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 400', () => {
    test('if country code has only one character', async () => {
      const data: CreateAddressDto = {
        label: 'Home',
        countryCode: 'U',
        name: 'John Doe',
        lineOne: '123 Main St',
        city: 'Springfield',
        region: 'IL',
        postalCode: '62701',
      };
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserAdmin),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `countryCode must have two characters and be valid according to ISO 3166-1 alpha-2`,
      );
    });

    test('if phoneNumber is over 50 chars', async () => {
      const data: CreateAddressDto = {
        label: 'Home',
        countryCode: 'PT',
        name: 'John Doe',
        lineOne: '123 Main St',
        city: 'Springfield',
        region: 'IL',
        postalCode: 'u94uXr9jedpk3hoVksDzh8Hv7CXdEJmQALMNdvTnR253Tjn3ZNE',
      };
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserAdmin),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `postalCode must NOT have more than 50 characters`,
      );
    });

    test('if maximum number of addresses is exceeded', async () => {
      const countAddressesMock = jest
        .spyOn(AddressesRepository, 'countAddressesByUserId')
        .mockImplementationOnce(async () => CONSTANTS.MAX_ADDRESSES_PER_USER);

      const data: CreateAddressDto = {
        label: 'Home',
        countryCode: 'PT',
        name: 'John Doe',
        lineOne: '123 Main St',
        city: 'Springfield',
        region: 'IL',
        lineTwo: 'Apt 1',
        postalCode: 'u94uXr9jed',
      };
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserAdmin),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `User has reached the maximum amount of addresses`,
      );
      expect(countAddressesMock).toHaveBeenCalledWith(verifiedUserAdmin.id);
      countAddressesMock.mockClear();
    });
  });

  describe('should return 403', () => {
    test('if user is not verified', async () => {
      const data: CreateAddressDto = {
        label: 'Home',
        countryCode: 'US',
        name: 'John Doe',
        lineOne: '123 Main St',
        city: 'Springfield',
        region: 'IL',
        postalCode: '62701',
      };
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(unverifiedUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });

    test('if user is inactive', async () => {
      const data: CreateAddressDto = {
        label: 'Home',
        countryCode: 'US',
        name: 'John Doe',
        lineOne: '123 Main St',
        city: 'Springfield',
        region: 'IL',
        postalCode: '62701',
      };
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(inactiveUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });
  });

  describe('should return 401', () => {
    test('if user is soft deleted', async () => {
      const data: CreateAddressDto = {
        label: 'Home',
        countryCode: 'US',
        name: 'John Doe',
        lineOne: '123 Main St',
        city: 'Springfield',
        region: 'IL',
        postalCode: '62701',
      };
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(softDeletedUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('should return 201', () => {
    test('should return 201', async () => {
      const data: CreateAddressDto = {
        label: 'Home',
        countryCode: 'US',
        name: 'John Doe',
        lineOne: '123 Main St',
        city: 'Springfield',
        region: 'IL',
        postalCode: '62701',
      };
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserAdmin),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.id).toBeDefined();
    });
  });
});
