import tk from 'timekeeper';

import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedBuyer,
  verifiedSeller,
  verifiedSellerProduct1,
  verifiedSellerSoftDeletedProduct,
} from '../../seeds/products.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('DELETE /api/products/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 404', () => {
    test('when product does not exist', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/b2bf4efa-99c2-43d7-a329-a8d0948d85dc`)
          .href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedSeller),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: `Product not found`,
      });
    });

    test('if product is already soft deleted', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerSoftDeletedProduct.id}`)
          .href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedSeller),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: `Product not found`,
      });
    });
  });

  describe('should return 403', () => {
    test('if user is a buyer', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/934f0b29-b4bb-458b-80f6-76c530209281`)
          .href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedBuyer),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });

    test('if user is inactive', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/934f0b29-b4bb-458b-80f6-76c530209281`)
          .href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(inactiveUser),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });

    test('if user is not verified', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/934f0b29-b4bb-458b-80f6-76c530209281`)
          .href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(unverifiedUser),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/934f0b29-b4bb-458b-80f6-76c530209281`)
          .href,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });
    });

    test('if user is soft deleted', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/934f0b29-b4bb-458b-80f6-76c530209281`)
          .href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(softDeletedUser),
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });
    });
  });

  describe('should return 400', () => {
    test('if id provided is not valid uuid', async () => {
      const invalidId = 'invalid-id';
      const response = await fetch(
        getTestServerUrl(`/api/products/${invalidId}`).href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedSeller),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `Invalid url parameter 'id': ${invalidId}`,
      });
    });
  });

  describe('should return 200', () => {
    test('if everything is ok', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedSeller),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product deleted',
      });
    });
  });
});
