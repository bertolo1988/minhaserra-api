import {
  inactiveUser,
  nonVerifiedUser,
  softDeletedUser,
  verifiedUserBuyerA,
  verifiedUserBuyerAAddress1,
  verifiedUserBuyerB,
} from '../../seeds/get-addresses.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('DELETE /api/addresses/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.GET_ADDRESSES);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${verifiedUserBuyerAAddress1.id}`)
          .href,
        {
          method: 'DELETE',
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
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${verifiedUserBuyerAAddress1.id}`)
          .href,
        {
          method: 'DELETE',
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
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${verifiedUserBuyerAAddress1.id}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(inactiveUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`Forbidden`);
    });

    test('if user email is not verified', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${verifiedUserBuyerAAddress1.id}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(nonVerifiedUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`Forbidden`);
    });
  });

  describe('should return 400', () => {
    test('if user tries to delete an address that is not valid', async () => {
      const addressId = 'invalid-address-id';
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${addressId}`).href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyerA),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `Invalid url parameter 'id': invalid-address-id`,
      );
    });
  });

  describe('should return 404', () => {
    test('if user tries to delete an address that does not belong to him', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${verifiedUserBuyerAAddress1.id}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyerB),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Address not found');
    });
  });

  describe('should return 200', () => {
    test('if user successfully deletes an address', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/addresses/${verifiedUserBuyerAAddress1.id}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedUserBuyerA),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe('Address deleted successfully');
    });
  });
});
