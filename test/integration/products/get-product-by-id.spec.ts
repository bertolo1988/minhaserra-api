import tk from 'timekeeper';

import {
  CreateProductDto,
  ProductCategory,
  ProductSubCategory,
} from '../../../src/controllers/products/products.types';
import { Currency } from '../../../src/types';
import { verifiedSellerProduct1 } from '../../seeds/products.seed';
import { DatabaseSeedNames, runSeedByName } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

const validBodyExample: CreateProductDto = {
  name: 'Product 1',
  description: 'Product 1 description',
  price: 100,
  availableQuantity: 1,
  category: ProductCategory.FOOD,
  subCategory: ProductSubCategory.FOOD_HONEY,
  countryCode: 'PT',
  currency: Currency.EUR,
  isOnSale: false,
};

describe('GET /api/products/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('when id is not valid uuid', async () => {
      const invalidId = 'invalid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${invalidId}`).href,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `Invalid url parameter 'id': ${invalidId}`,
      });
    });
  });

  describe('should return 404', () => {
    test('if does not exist product with provided id', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/ffd9593e-62f7-4372-b363-a2aeb5cfba4d`)
          .href,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ message: 'Product not found' });
    });
  });

  describe('should return 200', () => {
    test('should return a product', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();

      expect(body).toEqual({
        id: verifiedSellerProduct1.id,
        userId: verifiedSellerProduct1.userId,
        category: verifiedSellerProduct1.category,
        subCategory: verifiedSellerProduct1.subCategory,
        name: verifiedSellerProduct1.name,
        description: verifiedSellerProduct1.description,
        countryCode: verifiedSellerProduct1.countryCode,
        region: verifiedSellerProduct1.region,
        avaliableQuantity: verifiedSellerProduct1.avaliableQuantity,
        price: verifiedSellerProduct1.price,
        isOnSale: verifiedSellerProduct1.isOnSale,
        isApproved: verifiedSellerProduct1.isApproved,
        isDeleted: verifiedSellerProduct1.isDeleted,
        createdAt: verifiedSellerProduct1.createdAt.toISOString(),
        updatedAt: verifiedSellerProduct1.updatedAt.toISOString(),
      });
    });
  });
});
