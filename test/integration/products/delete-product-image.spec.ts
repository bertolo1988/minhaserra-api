import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedSeller1,
} from '../../seeds/product-images.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

const VALID_UUID = 'fcc13b9f-13ac-4e04-9eca-ce7f79faa2cc';

describe('DELETE /api/products/:id/images/:imageId', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS_IMAGES);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
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
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
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
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
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
      expect(body.message).toBe('Forbidden');
    });

    test('if user is not verified', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(unverifiedUser),
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
    test('if product id is malformed uuid', async () => {
      const malformedUuid = 'malformed-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${malformedUuid}/images/${VALID_UUID}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe("Invalid url parameter 'id': malformed-uuid");
    });

    test('if product image id is malformed uuid', async () => {
      const malformedUuid = 'malformed-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${malformedUuid}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `Invalid url parameter 'imageId': malformed-uuid`,
      );
    });
  });

  describe('should return 200', () => {
    test('when everything is correct', async () => {
      // TODO: Implement test
    });
  });
});
