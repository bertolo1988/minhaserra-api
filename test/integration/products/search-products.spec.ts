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
import { PaginationParams } from '../../../src/types';

describe('GET /api/public-products', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.MANY_PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 200', () => {
    test('empty query should return 10 results', async () => {
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

    test('and an empty list of products', async () => {
      const queryStringParams: Record<string, string | number> = {
        offset: 0,
        limit: 3,
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
