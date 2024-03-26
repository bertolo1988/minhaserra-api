import {
  inactiveUser,
  inactiveUserAddress,
  nonVerifiedUser,
  softDeletedUser,
  verifiedUserBuyer,
  verifiedUserBuyerAddress,
} from '../../seeds/get-address-by-id.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /api/addresses/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.GET_ADDRESS_BY_ID);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${addressId}`).href,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });

    test('if user is soft deleted', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${addressId}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(softDeletedUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('should return 403', () => {
    test('if user is inactive', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${addressId}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(inactiveUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });

    test('if user is not verified', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${addressId}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(nonVerifiedUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });
  });

  describe('should return 400', () => {
    test('if address id is not valid uuid', async () => {
      const addressId = '1111';
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${addressId}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid url parameter 'id': 1111`);
    });
  });

  describe('should return 404', () => {
    test('if user targets non existing address', async () => {
      const addressId = '1f655f84-9fde-45d6-ae80-0749f7449881';
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${addressId}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe(`Address not found`);
    });

    test('if user targets address owned by another player', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${inactiveUserAddress.id}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe(`Address not found`);
    });
  });

  describe('should return 200 and an address', () => {
    test('if user is active verified and targeted one of his addresses', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${verifiedUserBuyerAddress.id}`).href,
        {
          method: 'GET',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyer),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual(
        expect.objectContaining({
          id: verifiedUserBuyerAddress.id,
          userId: verifiedUserBuyer.id,
          label: verifiedUserBuyerAddress.label,
          countryCode: verifiedUserBuyerAddress.countryCode,
          name: verifiedUserBuyerAddress.name,
          lineOne: verifiedUserBuyerAddress.lineOne,
          lineTwo: verifiedUserBuyerAddress.lineTwo,
          city: verifiedUserBuyerAddress.city,
          region: verifiedUserBuyerAddress.region,
          postalCode: verifiedUserBuyerAddress.postalCode,
          phoneNumber: verifiedUserBuyerAddress.phoneNumber,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });
});
