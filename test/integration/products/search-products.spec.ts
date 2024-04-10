import _ from 'lodash';
import tk from 'timekeeper';

import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedBuyer,
  verifiedSeller,
  verifiedSellerNoProducts,
  verifiedSellerProduct1,
  verifiedSellerProduct2,
} from '../../seeds/products.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';
import { PaginationParams, SortDirection } from '../../../src/types';
import {
  ProductCategory,
  ProductSeachOrderByFields,
} from '../../../src/controllers/products/products.types';

describe('GET /api/public-products', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.MANY_PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test.skip('limit of 31', async () => {});

    test.skip('limit 6', async () => {});

    test.skip('limit offset of 3', async () => {});

    test.skip('negative minPrice', async () => {});

    test.skip('minPrice 0', async () => {});

    test.skip('maxPrice smaller than minPrice', async () => {});

    test.skip('minPrice with letters', async () => {});

    test.skip('minPrice negative', async () => {});

    test.skip('maxPrice that is way too big of a number', async () => {});
  });

  describe('should return 200', () => {
    test.skip('empty query should return 10 first results', async () => {
      // TODO: implement this test
      const queryStringParams: Record<string, string | number> = {};
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      console.log(body);
    });

    test.only('and an empty list of products', async () => {
      const queryStringParams: Record<string, string | number> = {
        offset: 0,
        limit: 10,
        category: ProductCategory.FOOD,
        maxPrice: 2500,
        text: 'wine',
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      console.log(body);
    });
  });
});
