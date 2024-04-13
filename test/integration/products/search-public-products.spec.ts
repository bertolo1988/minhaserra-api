import tk from 'timekeeper';

import _ from 'lodash';
import CONSTANTS from '../../../src/constants';
import { ProductCategory } from '../../../src/controllers/products/products.types';
import { TranslationService } from '../../../src/services/translation-service';
import { isArraySortedAscending } from '../../../src/utils/other-utils';
import { verifiedSellerNoProducts } from '../../seeds/products.seed';
import { testValidPublicProductModel } from '../../test-type-utils';
import {
  DatabaseSeedNames,
  getRequestHeadersWithotAuthorization,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

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
          headers: getRequestHeadersWithotAuthorization(),
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
          headers: getRequestHeadersWithotAuthorization(),
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
          headers: getRequestHeadersWithotAuthorization(),
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
          headers: getRequestHeadersWithotAuthorization(),
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
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `minPrice must be a natural number bigger than 0`,
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('maxPrice smaller than minPrice', async () => {
      const queryStringParams: Record<string, string | number> = {
        minPrice: 1000,
        maxPrice: 500,
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'maxPrice must be greater than minPrice',
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('minPrice with letters', async () => {
      const queryStringParams: Record<string, string | number> = {
        minPrice: 'aa',
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'minPrice must be a natural number bigger than 0',
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('minPrice negative', async () => {
      const queryStringParams: Record<string, string | number> = {
        minPrice: -1,
      };
      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'minPrice must be a natural number bigger than 0',
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('minPrice that is way too big of a number', async () => {
      const queryStringParams: Record<string, string | number> = {
        minPrice: CONSTANTS.MAX_PRICE_IN_CENTS,
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `minPrice must be smaller than ${CONSTANTS.MAX_PRICE_IN_CENTS}`,
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('maxPrice that is way too big of a number', async () => {
      const queryStringParams: Record<string, string | number> = {
        maxPrice: CONSTANTS.MAX_PRICE_IN_CENTS,
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: `maxPrice must be smaller than ${CONSTANTS.MAX_PRICE_IN_CENTS}`,
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('region empty string', async () => {
      const queryStringParams: Record<string, string | number> = {
        region: '',
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'region must NOT have fewer than 1 characters',
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('country code with 1 letter', async () => {
      const queryStringParams: Record<string, string | number> = {
        countryCode: 'A',
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message:
          'countryCode must have two characters and be valid according to ISO 3166-1 alpha-2',
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('country code with 3 letter', async () => {
      const queryStringParams: Record<string, string | number> = {
        countryCode: 'ABB',
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message:
          'countryCode must have two characters and be valid according to ISO 3166-1 alpha-2',
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });

    test('text with empty string', async () => {
      const queryStringParams: Record<string, string | number> = {
        text: '',
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({
        message: 'text must NOT have fewer than 1 characters',
      });
      expect(translateToEnglishAutoSpy).not.toHaveBeenCalled();
    });
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
          headers: getRequestHeadersWithotAuthorization(),
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
          headers: getRequestHeadersWithotAuthorization(),
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
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();

      expect(translateToEnglishAutoSpy).toHaveBeenCalledTimes(1);

      for (let product of body) {
        testValidPublicProductModel(product);
      }
    });

    test('expect empty array if country code is set to Russia', async () => {
      const queryStringParams: Record<string, string | number> = {
        countryCode: 'RU',
      };

      const response = await fetch(
        getTestServerUrl(`/api/public-products`, queryStringParams).href,
        {
          method: 'GET',
          headers: getRequestHeadersWithotAuthorization(),
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();

      expect(translateToEnglishAutoSpy).toHaveBeenCalledTimes(0);
      expect(body).toHaveLength(0);
    });
  });
});
