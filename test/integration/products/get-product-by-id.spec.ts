import tk from 'timekeeper';

import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedBuyer,
  verifiedSeller,
  verifiedSellerNoProducts,
  verifiedSellerProduct1,
  verifiedSellerNoProductsProduct1,
} from '../../seeds/products.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /api/products/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('when id is not valid uuid', async () => {
      const invalidId = 'invalid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${invalidId}`).href,
        {
          method: 'GET',
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

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/934f0b29-b4bb-458b-80f6-76c530209281`)
          .href,
        {
          method: 'GET',
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
          method: 'GET',
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

  describe('should return 403', () => {
    test('if user tries to delete product that he does not own', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Forbidden',
      });
    });

    test('if user is a buyer', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/934f0b29-b4bb-458b-80f6-76c530209281`)
          .href,
        {
          method: 'GET',
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
          method: 'GET',
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
          method: 'GET',
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

  describe('should return 404', () => {
    test('if does not exist product with provided id', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/ffd9593e-62f7-4372-b363-a2aeb5cfba4d`)
          .href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSeller),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ message: 'Product not found' });
    });

    test('if product is soft deleted', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerNoProductsProduct1.id}`)
          .href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ message: 'Product not found' });
    });
  });

  describe('should return 200', () => {
    test('should return a product', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSeller),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();

      expect(body).toEqual({
        id: verifiedSellerProduct1.id,
        userId: verifiedSellerProduct1.userId,
        category: verifiedSellerProduct1.category,
        subCategory: verifiedSellerProduct1.subCategory,
        language: verifiedSellerProduct1.language,
        name: verifiedSellerProduct1.name,
        nameEnglish: verifiedSellerProduct1.nameEnglish,
        description: verifiedSellerProduct1.description,
        descriptionEnglish: verifiedSellerProduct1.descriptionEnglish,
        countryCode: verifiedSellerProduct1.countryCode,
        region: verifiedSellerProduct1.region,
        availableQuantity: verifiedSellerProduct1.availableQuantity,
        price: verifiedSellerProduct1.price,
        isOnSale: verifiedSellerProduct1.isOnSale,
        isApproved: verifiedSellerProduct1.isApproved,
        isDeleted: verifiedSellerProduct1.isDeleted,
        createdAt: verifiedSellerProduct1.createdAt.toISOString(),
        updatedAt: verifiedSellerProduct1.updatedAt.toISOString(),
      });
    });
  });
});
