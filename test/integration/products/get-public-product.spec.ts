import tk from 'timekeeper';

import {
  verifiedSeller2NonApprovedProduct,
  verifiedSeller2NotForSaleProduct,
  verifiedSellerNoProductsProduct1,
  verifiedSellerProduct2,
} from '../../seeds/products.seed';
import { testValidPublicProductModel } from '../../test-type-utils';
import {
  DatabaseSeedNames,
  getRequestHeadersWithotAuthorization,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /api/public-products/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('if id is not valid uuid', async () => {
      const invalidUuid = 'aaa';
      const response = await fetch(
        getTestServerUrl(`/api/public-products/${invalidUuid}`).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ message: "Invalid url parameter 'id': aaa" });
    });
  });

  describe('should return 404', () => {
    test('if product is not found', async () => {
      const notFoundId = '8434e47f-89aa-4a05-94c1-456b9e3c43a2';
      const response = await fetch(
        getTestServerUrl(`/api/public-products/${notFoundId}`).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ message: 'Product not found' });
    });

    test('if product is deleted', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/public-products/${verifiedSellerNoProductsProduct1.id}`,
        ).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ message: 'Product not found' });
    });

    test('if product is not listed for sale', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/public-products/${verifiedSeller2NotForSaleProduct.id}`,
        ).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ message: 'Product not found' });
    });

    test('if product is not approved yet', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/public-products/${verifiedSeller2NonApprovedProduct.id}`,
        ).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ message: 'Product not found' });
    });
  });

  describe('should return 200', () => {
    test('and a valid public product if product is approved and on sale', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/public-products/${verifiedSellerProduct2.id}`)
          .href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      testValidPublicProductModel(body);
      expect(body.id).toBe(verifiedSellerProduct2.id);
    });
  });
});
