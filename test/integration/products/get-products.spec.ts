import _ from 'lodash';
import tk from 'timekeeper';

import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedBuyer,
  verifiedSeller,
  verifiedSellerNoProducts,
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

describe('GET /api/products', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    tk.reset();
  });

  describe('should return 403', () => {
    test('if user is a buyer', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'GET',
        headers: getRequestHeaders(verifiedBuyer),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });

    test('if user is inactive', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'GET',
        headers: getRequestHeaders(inactiveUser),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });

    test('if user is not verified', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'GET',
        headers: getRequestHeaders(unverifiedUser),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({
        message: `Forbidden`,
      });
    });
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });
    });

    test('if user is soft deleted', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'GET',
        headers: getRequestHeaders(softDeletedUser),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        message: `Unauthorized`,
      });
    });
  });

  describe('should return 200', () => {
    test('and an empty list of products, soft delete products are not showing either', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'GET',
        headers: getRequestHeaders(verifiedSellerNoProducts),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(_.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    });

    test('and a list of products, sorted by product name', async () => {
      const response = await fetch(getTestServerUrl(`/api/products`).href, {
        method: 'GET',
        headers: getRequestHeaders(verifiedSeller),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(_.isArray(body)).toBe(true);
      expect(body).toHaveLength(2);
      expect(body[0]).toEqual({
        id: verifiedSellerProduct2.id,
        userId: verifiedSellerProduct2.userId,
        category: verifiedSellerProduct2.category,
        subCategory: verifiedSellerProduct2.subCategory,
        language: verifiedSellerProduct2.language,
        name: verifiedSellerProduct2.name,
        nameEnglish: verifiedSellerProduct2.nameEnglish,
        description: verifiedSellerProduct2.description,
        descriptionEnglish: verifiedSellerProduct2.descriptionEnglish,
        countryCode: verifiedSellerProduct2.countryCode,
        region: verifiedSellerProduct2.region,
        availableQuantity: verifiedSellerProduct2.availableQuantity,
        price: verifiedSellerProduct2.price,
        isApproved: verifiedSellerProduct2.isApproved,
        isDeleted: verifiedSellerProduct2.isDeleted,
        isOnSale: verifiedSellerProduct2.isOnSale,
        createdAt: verifiedSellerProduct2.createdAt.toISOString(),
        updatedAt: verifiedSellerProduct2.updatedAt.toISOString(),
      });
      expect(body[1]).toEqual({
        id: verifiedSellerProduct1.id,
        userId: verifiedSellerProduct1.userId,
        category: verifiedSellerProduct1.category,
        subCategory: verifiedSellerProduct1.subCategory,
        language: verifiedSellerProduct1.language,
        name: verifiedSellerProduct1.name,
        nameEnglish: verifiedSellerProduct1.nameEnglish,
        description: verifiedSellerProduct1.description,
        descriptionEnglish: verifiedSellerProduct1.descriptionEnglish,
        countryCode: verifiedSellerProduct1.countryCode,
        region: verifiedSellerProduct1.region,
        availableQuantity: verifiedSellerProduct1.availableQuantity,
        price: verifiedSellerProduct1.price,
        isApproved: verifiedSellerProduct1.isApproved,
        isDeleted: verifiedSellerProduct1.isDeleted,
        isOnSale: verifiedSellerProduct1.isOnSale,
        createdAt: verifiedSellerProduct1.createdAt.toISOString(),
        updatedAt: verifiedSellerProduct1.updatedAt.toISOString(),
      });
    });
  });
});
