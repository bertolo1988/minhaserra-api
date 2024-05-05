import _ from 'lodash';
import tk from 'timekeeper';

import {
  verifiedBuyer1,
  verifiedBuyer1ShoppingCartItem1,
  verifiedBuyerEmptyCart,
  verifiedSeller1,
  verifiedSeller1Product1,
} from '../../seeds/shopping-cart.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  getRequestHeadersWithotAuthorization,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /api/shopping-cart-items', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.SHOPPING_CART);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    tk.reset();
  });

  describe('should return 401', () => {
    test('if endpoint is contacted without login', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({ message: 'Unauthorized' });
    });
  });

  describe('should return 403', () => {
    test('if endpoint is contacted with a seller login', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSeller1),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({ message: 'Forbidden' });
    });
  });

  describe('should return 200', () => {
    test('and an empty shopping cart', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedBuyerEmptyCart),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(_.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    });

    test('and a shopping cart with one item', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items`).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedBuyer1),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(_.isArray(body)).toBe(true);
      expect(body).toHaveLength(1);
      expect(body[0]).toEqual(
        expect.objectContaining({
          id: verifiedBuyer1ShoppingCartItem1.id,
          userId: verifiedBuyer1ShoppingCartItem1.userId,
          productName: verifiedSeller1Product1.nameEnglish,
          productId: verifiedBuyer1ShoppingCartItem1.productId,
          productPrice: `${verifiedSeller1Product1.price}`,
          quantity: verifiedBuyer1ShoppingCartItem1.quantity,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });
});
