import tk from 'timekeeper';
import iso3311a2 from 'iso-3166-1-alpha-2';

import {
  ProductCategory,
  ProductSubCategory,
} from '../../../src/controllers/products/products.types';
import { TranslationService } from '../../../src/services/translation-service';
import { isArraySortedAscending } from '../../../src/utils/other-utils';
import { verifiedSellerNoProducts } from '../../seeds/products.seed';
import {
  DatabaseSeedNames,
  getRequestHeaders,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';
import { Language } from '../../../src/types';
import _ from 'lodash';

function testValidPublicProductModel(input: unknown) {
  expect(input).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      userId: expect.any(String),
      category: expect.stringMatching(Object.values(ProductCategory).join('|')),
      subCategory: expect.stringMatching(
        Object.values(ProductSubCategory).join('|'),
      ),
      language: expect.stringMatching(Object.values(Language).join('|')),
      name: expect.any(String),
      nameEnglish: expect.any(String),
      description: expect.any(String),
      descriptionEnglish: expect.any(String),
      countryCode: expect.stringMatching(iso3311a2.getCodes().join('|')),
      region: expect.any(String),
      availableQuantity: expect.any(Number),
      price: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      images: expect.arrayContaining([]),
    }),
  );
  expect(_.isArray((input as any).images)).toBe(true);
}

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
    let translateToEnglishAutoSpy: jest.SpyInstance;

    beforeEach(() => {
      translateToEnglishAutoSpy = jest.spyOn(
        TranslationService.prototype,
        'translateToEnglishAuto',
      );
    });

    afterEach(() => {
      translateToEnglishAutoSpy.mockClear();
    });

    test('limit of 31', async () => {
      const queryStringParams: Record<string, string | number> = {
        limit: 31,
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ message: "'limit' must be less than 30" });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('limit 6', async () => {
      const queryStringParams: Record<string, string | number> = {
        limit: '6',
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ message: "'limit' must be multiple of 10" });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('offset of 3', async () => {
      const queryStringParams: Record<string, string | number> = {
        offset: 3,
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ message: "'offset' must be multiple of 10" });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('negative minPrice', async () => {
      const queryStringParams: Record<string, string | number> = {
        minPrice: -1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `minPrice must be a natural number bigger than 0`,
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('minPrice 0', async () => {
      const queryStringParams: Record<string, string | number> = {
        minPrice: 0,
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeaders(verifiedSellerNoProducts),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `minPrice must be a natural number bigger than 0`,
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    // TODO: continue implementing theses tests
    test.skip('maxPrice smaller than minPrice', async () => {});

    test.skip('minPrice with letters', async () => {});

    test.skip('minPrice negative', async () => {});

    test.skip('maxPrice that is way too big of a number', async () => {});

    test.skip('region empty string', async () => {});
  });

  describe('should return 200', () => {
    let translateToEnglishAutoSpy: jest.SpyInstance;

    beforeEach(() => {
      translateToEnglishAutoSpy = jest
        .spyOn(TranslationService.prototype, 'translateToEnglishAuto')
        .mockImplementation(async (input: string) => {
          return input;
        });
    });

    afterEach(() => {
      translateToEnglishAutoSpy.mockClear();
    });

    test('and empty array', async () => {
      const queryStringParams: Record<string, string | number> = {
        text: 'ajnsdasjbdakjdbakjbd',
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
      expect(translateToEnglishAutoSpy).toHaveBeenCalledTimes(1);
      expect(_.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    });

    test('expect 4 wines of price below the target sorted by cheapest first (default sort)', async () => {
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

      expect(translateToEnglishAutoSpy).toHaveBeenCalledTimes(1);
      expect(translateToEnglishAutoSpy).toHaveBeenCalledWith('wine');

      expect(body.length).toBe(4);

      expect(
        isArraySortedAscending(body.map((p: any) => parseInt(p.price))),
      ).toBe(true);

      for (let product of body) {
        testValidPublicProductModel(product);
      }
    });

    test('expect all results to be valid public products', async () => {
      const queryStringParams: Record<string, string | number> = {
        offset: 0,
        limit: 10,
        text: 'honey',
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

      expect(translateToEnglishAutoSpy).toHaveBeenCalledTimes(1);

      for (let product of body) {
        testValidPublicProductModel(product);
      }
    });
  });
});
