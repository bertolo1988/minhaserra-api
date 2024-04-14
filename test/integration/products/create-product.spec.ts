import tk from 'timekeeper';

import {
  CreateProductDto,
  ProductCategory,
  ProductSubCategory,
} from '../../../src/controllers/products/products.types';
import { Currency, Language } from '../../../src/types';
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
import { TranslationService } from '../../../src/services/translation-service';
import { ProductsRepository } from '../../../src/controllers/products/products.repository';

const validBodyExample: CreateProductDto = {
  language: Language.ENGLISH,
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
  let translateToEnglishSpy: jest.SpyInstance;

  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  beforeAll(async () => {
    translateToEnglishSpy = jest
      .spyOn(TranslationService.prototype, 'translateToEnglish')
      .mockResolvedValue('translated string');
  });

  afterEach(async () => {
    translateToEnglishSpy.mockClear();
  });

  afterAll(async () => {
    jest.resetAllMocks();
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
    });

    test('when name provided is an empty string', async () => {
      const data: CreateProductDto = {
        language: Language.PORTUGUESE,
        name: '',
        description: 'Mel biológico da Serra de Aire e Candeeiros',
        price: 1000,
        availableQuantity: 10,
        category: ProductCategory.FOOD,
        subCategory: ProductSubCategory.FOOD_OTHER,
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
        message: `name must NOT have fewer than 2 characters`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
    });

    test('when description provided is an empty string', async () => {
      const data: CreateProductDto = {
        language: Language.PORTUGUESE,
        name: 'AP',
        description: '',
        price: 1000,
        availableQuantity: 10,
        category: ProductCategory.FOOD,
        subCategory: ProductSubCategory.FOOD_OTHER,
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
        message: `description must NOT have fewer than 2 characters`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
    });

    test('when sub category is invalid value', async () => {
      const data: CreateProductDto = {
        language: Language.PORTUGUESE,
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
    });

    test('when category is invalid value', async () => {
      const data: CreateProductDto = {
        language: Language.PORTUGUESE,
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
    });

    test('when category does not exist', async () => {
      const data: CreateProductDto = {
        language: Language.ENGLISH,
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        // category: ProductCategory.FOOD,
        subCategory: ProductSubCategory.FOOD_HONEY,
        countryCode: 'PT',
        availableQuantity: 2,
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
    });

    test('when subcategory prefix does not match category', async () => {
      const data: CreateProductDto = {
        language: Language.ENGLISH,
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
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

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
      translateToEnglishSpy.mockClear();
    });
  });

  describe('should return 201', () => {
    test('should successfully create a product for our seller and translate name and description', async () => {
      const data: CreateProductDto = {
        language: Language.PORTUGUESE,
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

      const product = await ProductsRepository.getProductById(body.id);
      // product must be waiting admin approval
      expect(product?.isApproved).toBe(false);

      // expect search support structures to exist
      expect(product?.searchDocument).toBeDefined();
      expect(product?.nameEnglish).toBeDefined();
      expect(product?.descriptionEnglish).toBeDefined();

      expect(translateToEnglishSpy).toHaveBeenCalledTimes(2);
      translateToEnglishSpy.mockClear();
    });
  });
});
