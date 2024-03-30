import tk from 'timekeeper';

import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedBuyer,
  verifiedSeller,
  verifiedSellerNoProducts,
  verifiedSellerProduct1,
} from '../../seeds/products.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';
import { UpdateProductDto } from '../../../src/controllers/products/products.types';

const VALID_UUID = '69163cd6-a2b1-4bc4-916a-7f1643d893ed';

describe('PUT /api/products/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('if product id is not valid uuid', async () => {
      const invalidProductId = 'invalid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${invalidProductId}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify({}),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: "Invalid url parameter 'id': invalid-uuid",
      });
    });

    test('if user attempts to update userId', async () => {
      const data: UpdateProductDto = {
        userId: '6ef9b90f-8aaa-4996-b233-0c9b21bd3741',
      } as unknown as UpdateProductDto;
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'must NOT have additional properties',
      });
    });

    test.skip('if category does not match the category', async () => {});
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
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
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
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
    test('if user is a buyer', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
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
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
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
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
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
    test('if user tries to update product that he doesnt own', async () => {
      const data: UpdateProductDto = {
        region: 'Lisboa',
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSellerNoProducts),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });
    });

    test.skip('if product is soft deleted', async () => {});

    test('if product does not exist', async () => {
      const data: UpdateProductDto = {
        region: 'Lisboa',
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/5bc3dc52-55a9-4167-9051-77cb4018f203`)
          .href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });
    });
  });

  describe('should return 200', () => {
    test.skip('and successfully udpate record', async () => {
      // updateAt must change!
    });
  });
});
