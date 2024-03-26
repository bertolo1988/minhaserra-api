import {
  verifiedSeller1,
  verifiedSeller1Product1,
  verifiedSeller2,
} from '../../seeds/product-images.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('DELETE /api/products/:id/images/:imageId', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS_IMAGES);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 400', () => {
    test('if product id is malformed uuid', async () => {
      const malformedUuid = 'malformed-uuid';
      const response = await fetch(
        getTestServerUrl(
          `/api/products/${malformedUuid}/images/fcc13b9f-13ac-4e04-9eca-ce7f79faa2cc`,
        ).href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid id: malformed-uuid`);
    });
  });
});
