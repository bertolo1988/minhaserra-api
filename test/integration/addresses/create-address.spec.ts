import { CreateAddressDto } from '../../../src/controllers/addresses/addresses.types';
import { verifiedUserAdmin } from '../../seeds/create-address.seed';
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
    await runSeedByName(DatabaseSeedNames.CREATE_ADDRESS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 400', () => {});

  describe('should return 403', () => {});

  describe('should return 201', () => {
    it('should return 201', async () => {
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
