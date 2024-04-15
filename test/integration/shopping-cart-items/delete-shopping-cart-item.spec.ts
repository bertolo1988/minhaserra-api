import tk from 'timekeeper';

import {
  verifiedBuyer1,
  verifiedBuyer1ShoppingCartItem1,
  verifiedBuyer2,
  verifiedSeller1,
} from '../../seeds/shopping-cart.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  getRequestHeadersWithotAuthorization,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('DELETE /api/shopping_cart_items/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.SHOPPING_CART);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('when id is not a valid uuid', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items/invaliduuid`).href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedBuyer1),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: "Invalid url parameter 'id': invaliduuid",
      });
    });
  });

  describe('should return 401', () => {
    test('if authorization is not provided', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/85f2f213-b9f2-473f-8686-bc0b88d21257`,
        ).href,
        {
          method: 'DELETE',
          headers: getRequestHeadersWithotAuthorization(),
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
    test('if user is a seller, endpoint is only for buyers', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/85f2f213-b9f2-473f-8686-bc0b88d21257`,
        ).href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedSeller1),
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
    test('when item is not found', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/85f2f213-b9f2-473f-8686-bc0b88d21257`,
        ).href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedBuyer1),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Shopping cart item not found',
      });
    });

    test('when item exists but belongs to a different user', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/${verifiedBuyer1ShoppingCartItem1.id}`,
        ).href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedBuyer2),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Shopping cart item not found',
      });
    });
  });

  describe('should return 200', () => {
    test('when item is successfully removed', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/${verifiedBuyer1ShoppingCartItem1.id}`,
        ).href,
        {
          method: 'DELETE',
          headers: getRequestHeaders(verifiedBuyer1),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Shopping cart item deleted successfully',
      });
    });
  });
});
