import tk from 'timekeeper';

import CONSTANTS from '../../../src/constants';
import { CreateShoppingCartItemDto } from '../../../src/controllers/shopping-cart-items/shopping-cart-items.types';
import {
  verifiedBuyer,
  verifiedSeller,
  verifiedSeller2NonApprovedProduct,
  verifiedSeller2NotForSaleProduct,
  verifiedSellerNoProductsProduct1,
  verifiedSellerProduct1,
  verifiedSellerProduct2,
} from '../../seeds/products.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  getRequestHeadersWithotAuthorization,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('POST /api/shopping-cart-items', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test.skip('if limit of products in shopping cart is reached', async () => {
      // TODO: Implement this test. Not urgent since it is limited by number of products in the db.
    });

    test('when product id is invalid', async () => {
      const data = {
        productId: 'invalid-uuid',
        quantity: 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'productId must match format "uuid"',
      });
    });

    test('when quantity is negative', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: '49c0ce7c-261e-4035-98aa-b35a055b4d5c',
        quantity: -1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'quantity must be >= 1',
      });
    });

    test('when quantity is too big', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: '49c0ce7c-261e-4035-98aa-b35a055b4d5c',
        quantity: CONSTANTS.MAX_AVAILABLE_QUANTITY + 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'quantity must be <= 2147483647',
      });
    });
  });

  describe('should return 401', () => {
    test('if endpoint is contacted without login', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: '49c0ce7c-261e-4035-98aa-b35a055b4d5c',
        quantity: 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeadersWithotAuthorization(),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Unauthorized',
      });
    });
  });

  describe('should return 403', () => {
    test('if user is not a buyer', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: '49c0ce7c-261e-4035-98aa-b35a055b4d5c',
        quantity: 2,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Forbidden',
      });
    });
  });

  describe('should return 404', () => {
    test('when product does not exist', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: '49c0ce7c-261e-4035-98aa-b35a055b4d5c',
        quantity: 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });
    });

    test('when product is not for sale', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: verifiedSeller2NotForSaleProduct.id,
        quantity: 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });
    });

    test('when product is not approved', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: verifiedSeller2NonApprovedProduct.id,
        quantity: 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });
    });

    test('when product is soft deleted', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: verifiedSellerNoProductsProduct1.id,
        quantity: 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });
    });

    test('when product is out of stock', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: verifiedSellerProduct2.id,
        quantity: verifiedSellerProduct2.availableQuantity + 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product is out of stock',
      });
    });
  });

  describe('should return 409', () => {
    test('if item already exists in shopping cart', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: verifiedSellerProduct1.id,
        quantity: verifiedSellerProduct1.availableQuantity - 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(409);
      const body = await response.json();
      expect(body).toEqual({
        message: `Product with id ${verifiedSellerProduct1.id} already exists in the shopping cart`,
      });
    });
  });

  describe('should return 201', () => {
    test('when product successfully added to cart', async () => {
      const data: CreateShoppingCartItemDto = {
        productId: verifiedSellerProduct2.id,
        quantity: verifiedSellerProduct2.availableQuantity - 1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'POST',
          headers: getRequestHeaders(verifiedBuyer),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toEqual({
        id: expect.any(String),
      });
    });
  });
});
