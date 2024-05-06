import moment from 'moment';

import CONSTANTS from '../../../src/constants';
import { ShoppingCartItemsRepository } from '../../../src/controllers/shopping-cart-items/shopping-cart-items.repository';
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

describe('PATCH /api/shopping-cart-items/:id/quantity', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.SHOPPING_CART);
  });

  describe('should return 400', () => {
    test('if item id is not a valid uuid', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/shopping-cart-items/invaliduuid/quantity`).href,
        {
          method: 'PATCH',
          headers: getRequestHeaders(verifiedBuyer1),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: "Invalid url parameter 'id': invaliduuid",
      });
    });

    test('if quantity is negative', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/85f2f213-b9f2-473f-8686-bc0b88d21257/quantity`,
        ).href,
        {
          method: 'PATCH',
          headers: getRequestHeaders(verifiedBuyer1),
          body: JSON.stringify({ quantity: -1 }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'quantity must be >= 1',
      });
    });

    test('if quantity is too big', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/85f2f213-b9f2-473f-8686-bc0b88d21257/quantity`,
        ).href,
        {
          method: 'PATCH',
          headers: getRequestHeaders(verifiedBuyer1),
          body: JSON.stringify({
            quantity: CONSTANTS.MAX_CART_ITEMS_PER_PRODUCTS + 1,
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `quantity must be <= ${CONSTANTS.MAX_CART_ITEMS_PER_PRODUCTS}`,
      });
    });
  });

  describe('should return 401', () => {
    test('if authorization is not provided', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/85f2f213-b9f2-473f-8686-bc0b88d21257/quantity`,
        ).href,
        {
          method: 'PATCH',
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
          `/api/shopping-cart-items/85f2f213-b9f2-473f-8686-bc0b88d21257/quantity`,
        ).href,
        {
          method: 'PATCH',
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
    test('if item is owned by another user', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/${verifiedBuyer1ShoppingCartItem1.id}/quantity`,
        ).href,
        {
          method: 'PATCH',
          headers: getRequestHeaders(verifiedBuyer2),
          body: JSON.stringify({ quantity: 2 }),
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
    test('if update works as expected', async () => {
      const updateQuantitySpy = jest.spyOn(
        ShoppingCartItemsRepository,
        'updateQuantity',
      );

      const previousUpdatedAt = verifiedBuyer1ShoppingCartItem1.updatedAt;

      const response = await fetch(
        getTestServerUrl(
          `/api/shopping-cart-items/${verifiedBuyer1ShoppingCartItem1.id}/quantity`,
        ).href,
        {
          method: 'PATCH',
          headers: getRequestHeaders(verifiedBuyer1),
          body: JSON.stringify({ quantity: 2 }),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Shopping cart item updated successfully',
      });

      expect(updateQuantitySpy).toHaveBeenCalledTimes(1);
      const updateReturnResult = await updateQuantitySpy.mock.results[0].value;
      expect(updateReturnResult[0].updated_at).toBeDefined();
      expect(
        moment(updateReturnResult[0].updated_at).isAfter(previousUpdatedAt),
      ).toBe(true);

      updateQuantitySpy.mockRestore();
    });
  });
});
