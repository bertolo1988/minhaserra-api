import tk from 'timekeeper';

import {
  CreateProductDto,
  ProductCategory,
  ProductSubCategory,
} from '../../../src/controllers/products/products.types';
import { Currency } from '../../../src/types';
import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedBuyer,
  verifiedSeller,
} from '../../seeds/products.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
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

    test('when sub category is invalid value', async () => {
      const data: CreateProductDto = {
        name: 'Mel do Carlos',
        description: 'Mel biológico da Serra de Aire e Candeeiros',
        price: 1000,
        availableQuantity: 10,
        category: ProductCategory.FOOD,
        subCategory: 'aaaa' as ProductSubCategory,
        countryCode: 'PT',
        region: 'Leiria',
        currency: Currency.EUR,
        isOnSale: true,
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
        message: `subCategory must be equal to one of the allowed values`,
      });
    });

    test('when category is invalid value', async () => {
      const data: CreateProductDto = {
        name: 'Mel do Carlos',
        description: 'Mel biológico da Serra de Aire e Candeeiros',
        price: 1000,
        availableQuantity: 10,
        category: 'aaa' as ProductCategory,
        subCategory: ProductSubCategory.FOOD_DRINKS,
        countryCode: 'PT',
        region: 'Leiria',
        currency: Currency.EUR,
        isOnSale: true,
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
        message: `category must be equal to one of the allowed values`,
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
  });

  describe('should return 401', () => {
    test('when user is not authenticated', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validBodyExample),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });
    });

    test('when user is soft deleted', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(softDeletedUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validBodyExample),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });
    });
  });

  describe('should return 403', () => {
    test('when user is a buyer', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedBuyer),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validBodyExample),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });

    test('when the user is inactive', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(inactiveUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validBodyExample),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });

    test('when the user is not verified', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(unverifiedUser),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validBodyExample),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });
  });

  describe('should return 201', () => {
    test.only('should successfully create a product for our seller', async () => {
      const data: CreateProductDto = {
        name: 'Mel do Carlos',
        description: 'Mel biológico da Serra de Aire e Candeeiros',
        price: 1000,
        availableQuantity: 10,
        category: ProductCategory.FOOD,
        subCategory: ProductSubCategory.FOOD_HONEY,
        countryCode: 'PT',
        region: 'Leiria',
        currency: Currency.EUR,
        isOnSale: true,
      };

      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(verifiedSeller),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toEqual({
        id: expect.any(String),
      });
    });
  });
});
