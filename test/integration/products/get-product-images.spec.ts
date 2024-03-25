import _ from 'lodash';
import {
  verifiedSeller1,
  verifiedSeller1Product1,
  verifiedSeller2,
  verifiedSeller2Product1,
  verifiedSeller2Product1Images,
} from '../../seeds/product-images.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /products/:id/images', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS_IMAGES);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 404', () => {
    test('if product id does not exist', async () => {
      const nonExistingProductId = '13fdc915-c0ed-4bc2-908b-ccbabe54f75a';
      const response = await fetch(
        getTestServerUrl(`/api/products/${nonExistingProductId}/images`).href,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Product not found');
    });
  });

  describe('should return 400', () => {
    test('if product id is malformed uuid', async () => {
      const malformedUuid = 'malformed-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${malformedUuid}/images`).href,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe('Invalid id: malformed-uuid');
    });
  });

  describe('without authentication, should return 200', () => {
    test('and a list of images for a product', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller2Product1.id}/images`)
          .href,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(_.isArray(body)).toBe(true);
      expect(body).toHaveLength(verifiedSeller2Product1Images.length);
      for (let image of body) {
        expect(image).toMatchObject({
          id: expect.any(String),
          url: expect.any(String),
          description: expect.any(String),
        });
      }
    });

    test('and an empty list of images if product has no images', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(_.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    });
  });
});
