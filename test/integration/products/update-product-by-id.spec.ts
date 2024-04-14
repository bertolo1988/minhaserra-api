import moment from 'moment';
import tk from 'timekeeper';

import CONSTANTS from '../../../src/constants';
import { ProductsRepository } from '../../../src/controllers/products/products.repository';
import {
  ProductCategory,
  ProductSubCategory,
  UpdateProductDto,
} from '../../../src/controllers/products/products.types';
import { TranslationService } from '../../../src/services/translation-service';
import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedBuyer,
  verifiedSeller,
  verifiedSellerNoProducts,
  verifiedSellerNoProductsProduct1,
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

const VALID_UUID = '69163cd6-a2b1-4bc4-916a-7f1643d893ed';

describe('PUT /api/products/:id', () => {
  let translateToEnglishSpy: jest.SpyInstance;

  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
    translateToEnglishSpy = jest
      .spyOn(TranslationService.prototype, 'translateToEnglish')
      .mockResolvedValue('translated string');
  });

  afterEach(() => {
    translateToEnglishSpy.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('should return 400', () => {
    test('if product id is not valid uuid', async () => {
      const invalidProductId = 'invalid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${invalidProductId}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify({}),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: "Invalid url parameter 'id': invalid-uuid",
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if user attempts to update userId', async () => {
      const data: UpdateProductDto = {
        userId: '6ef9b90f-8aaa-4996-b233-0c9b21bd3741',
      } as unknown as UpdateProductDto;
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'must NOT have additional properties',
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if user attempts to update updateAt', async () => {
      const data: UpdateProductDto = {
        updateAt: new Date().toISOString(),
      } as unknown as UpdateProductDto;
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'must NOT have additional properties',
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if user attempts to update product name with an empty string', async () => {
      const data: UpdateProductDto = {
        name: '',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'name must NOT have fewer than 2 characters',
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if user attempts to update product description with an empty string', async () => {
      const data: UpdateProductDto = {
        description: '',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'description must NOT have fewer than 2 characters',
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if both category and sub category get replaced by an invalid pair', async () => {
      const data: UpdateProductDto = {
        category: ProductCategory.TOYS,
        subCategory: ProductSubCategory.CLOTHING_TSHIRTS,
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `'${data.subCategory}' is not a valid sub category of category '${data.category}'`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if sub category is updated to a value that is invalid with already existing category', async () => {
      const data: UpdateProductDto = {
        subCategory: ProductSubCategory.CLOTHING_TSHIRTS,
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `'${data.subCategory}' is not a valid sub category of category 'food'`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if category is updated to a value that is invalid with already existing subCategory', async () => {
      const data: UpdateProductDto = {
        category: ProductCategory.HOME,
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `'food_honey' is not a valid sub category of category '${data.category}'`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if category is not valid', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify({
            category: 'aaa',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `category must be equal to one of the allowed values`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if sub category is not valid', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify({
            subCategory: 'aaa',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `subCategory must be equal to one of the allowed values`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if max price is exceeded', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify({
            price: CONSTANTS.MAX_PRICE_IN_CENTS + 1,
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `price must be <= 9007199254740991`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if isOnSale is a string', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify({
            isOnSale: 'true',
          }),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `isOnSale must be boolean`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if user is soft deleted', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(softDeletedUser),
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });
  });

  describe('should return 403', () => {
    test('if user is a buyer', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedBuyer),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });

    test('if user is inactive', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(inactiveUser),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if user is not verified', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(unverifiedUser),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if user tries to update product that he doesnt own', async () => {
      const data: UpdateProductDto = {
        region: 'Lisboa',
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSellerNoProducts),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Forbidden',
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });
  });

  describe('should return 404', () => {
    test('if product is soft deleted', async () => {
      const data: UpdateProductDto = {
        region: 'Lisboa',
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerNoProductsProduct1.id}`)
          .href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSellerNoProducts),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('if product does not exist', async () => {
      const data: UpdateProductDto = {
        region: 'Lisboa',
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/5bc3dc52-55a9-4167-9051-77cb4018f203`)
          .href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product not found',
      });

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });
  });

  describe('should return 200', () => {
    let updateRepositorySpy: jest.SpyInstance;

    beforeAll(() => {
      updateRepositorySpy = jest.spyOn(
        ProductsRepository,
        'updateProductByIdAndUserId',
      );
    });

    afterEach(() => {
      updateRepositorySpy.mockClear();
    });

    afterAll(() => {
      updateRepositorySpy.mockRestore();
    });

    test('and successfully update record, no translations are done because name and description are unchanged', async () => {
      const data: UpdateProductDto = {
        region: 'Lisboa',
        price: 10050,
        subCategory: ProductSubCategory.FOOD_OLIVE_OIL,
      };

      const productId = verifiedSellerProduct1.id;
      const previousUpdatedAt = verifiedSellerProduct1.updatedAt;
      const response = await fetch(
        getTestServerUrl(`/api/products/${productId}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product updated',
      });

      expect(updateRepositorySpy).toHaveBeenCalledTimes(1);

      const updateResult = await updateRepositorySpy.mock.results[0].value;
      expect(updateResult).toHaveLength(1);
      expect(updateResult[0].id).toBe(productId);
      expect(updateResult[0].updated_at).toBeDefined();
      expect(
        moment(updateResult[0].updated_at).isAfter(previousUpdatedAt),
      ).toBe(true);
      // requires new approval after being changed
      expect(updateResult[0].is_approved).toBe(false);

      expect(translateToEnglishSpy).not.toHaveBeenCalled();
    });

    test('and successfully update product name and description while also storing the translations in english', async () => {
      const data: UpdateProductDto = {
        name: 'Mel de Sargaço',
        description: 'Mel biológico feito por flor de Sargaço.',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct2.id}`).href,
        {
          method: 'PUT',
          headers: getRequestHeaders(verifiedSeller),
          body: JSON.stringify(data),
        },
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        message: 'Product updated',
      });

      expect(updateRepositorySpy).toHaveBeenCalledTimes(1);

      const updateResult = await updateRepositorySpy.mock.results[0].value;
      expect(updateResult).toHaveLength(1);
      expect(updateResult[0].id).toBe(verifiedSellerProduct2.id);
      expect(updateResult[0].updated_at).toBeDefined();
      // requires new approval after being changed
      expect(updateResult[0].is_approved).toBe(false);

      expect(translateToEnglishSpy).toHaveBeenCalledTimes(2);
    });
  });
});
