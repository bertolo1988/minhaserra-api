import tk from 'timekeeper';

import { verifiedSeller } from '../../seeds/product-images.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('POST /api/products/:id/images', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS_IMAGES);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('if product id is not a valid uuid', async () => {
      const productId = 'not-valid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${productId}/images`).href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid id: ${productId}`);
    });
  });
});
