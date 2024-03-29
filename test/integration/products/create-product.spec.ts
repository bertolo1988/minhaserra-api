import tk from 'timekeeper';
import {
  CreateProductDto,
  ProductCategory,
  ProductSubCategory,
} from '../../../src/controllers/products/products.types';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';
import { verifiedSeller } from '../../seeds/products.seed';
import { Currency } from '../../../src/types';

describe('POST /api/products', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('when the request body is empty', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedSeller),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: "must have required property 'category'",
      });
    });

    test('when category does not exist', async () => {
      const data: CreateProductDto = {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        // category: ProductCategory.FOOD,
        subCategory: ProductSubCategory.FOOD_HONEY,
        countryCode: 'PT',
        avaliableQuantity: 2,
        currency: Currency.EUR,
        isOnSale: false,
      } as unknown as CreateProductDto;

      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedSeller),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: "must have required property 'category'",
      });
    });

    test('when subcategory prefix does not match category', async () => {
      const data: CreateProductDto = {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        availableQuantity: 1,
        category: ProductCategory.FOOD,
        subCategory: ProductSubCategory.CLOTHING_SWEATERS,
        countryCode: 'PT',
        currency: Currency.EUR,
        isOnSale: false,
      };

      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedSeller),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `'${data.subCategory}' is not a valid sub category of category '${data.category}'`,
      });
    });

    test.skip('when user reached maximum number of products', async () => {});
  });

  describe('should return 401', () => {
    test.skip('when user is not authenticated', async () => {});

    test.skip('when user is soft deleted', async () => {});
  });

  describe('should return 403', () => {
    test.skip('when user is a buyer', async () => {});

    test.skip('when the user is inactive', async () => {});

    test.skip('when the user is not verified', async () => {});
  });

  describe('should return 404', () => {});

  describe('should return 201', () => {
    test.skip('should successfully create a product for our seller', async () => {});
  });
});
