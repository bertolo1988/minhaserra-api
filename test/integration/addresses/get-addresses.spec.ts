import {
  inactiveUser,
  nonVerifiedUser,
  softDeletedUser,
  verifiedUserBuyerA,
  verifiedUserBuyerAAddress1,
  verifiedUserBuyerAAddress2,
  verifiedUserBuyerAAddress3,
  verifiedUserBuyerB,
} from '../../seeds/get-addresses.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /api/addresses', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.GET_ADDRESSES);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should return 401', () => {
    it('if user is not authenticated', async () => {
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });

    it('if user is soft deleted', async () => {
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(softDeletedUser),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('should return 403', () => {
    it('if user is inactive', async () => {
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(inactiveUser),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });

    it('if user is not verified', async () => {
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(nonVerifiedUser),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });
  });

  describe('should return 200 and', () => {
    it('an empty list of addresses if the user has none', async () => {
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyerB),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('a list of addresses if the user has any', async () => {
      const response = await fetch(getTestServerUrl(`/api/addresses`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUserBuyerA),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.length).toBe(3);
      expect(body[0]).toEqual({
        id: verifiedUserBuyerAAddress1.id,
        userId: verifiedUserBuyerA.id,
        label: verifiedUserBuyerAAddress1.label,
        countryCode: verifiedUserBuyerAAddress1.countryCode,
        name: verifiedUserBuyerAAddress1.name,
        lineOne: verifiedUserBuyerAAddress1.lineOne,
        lineTwo: verifiedUserBuyerAAddress1.lineTwo,
        city: verifiedUserBuyerAAddress1.city,
        region: verifiedUserBuyerAAddress1.region,
        postalCode: verifiedUserBuyerAAddress1.postalCode,
        phoneNumber: verifiedUserBuyerAAddress1.phoneNumber,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(body[1]).toEqual({
        id: verifiedUserBuyerAAddress2.id,
        userId: verifiedUserBuyerA.id,
        label: verifiedUserBuyerAAddress2.label,
        countryCode: verifiedUserBuyerAAddress2.countryCode,
        name: verifiedUserBuyerAAddress2.name,
        lineOne: verifiedUserBuyerAAddress2.lineOne,
        lineTwo: verifiedUserBuyerAAddress2.lineTwo,
        city: verifiedUserBuyerAAddress2.city,
        region: verifiedUserBuyerAAddress2.region,
        postalCode: verifiedUserBuyerAAddress2.postalCode,
        phoneNumber: verifiedUserBuyerAAddress2.phoneNumber,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(body[2]).toEqual({
        id: verifiedUserBuyerAAddress3.id,
        userId: verifiedUserBuyerA.id,
        label: verifiedUserBuyerAAddress3.label,
        countryCode: verifiedUserBuyerAAddress3.countryCode,
        name: verifiedUserBuyerAAddress3.name,
        lineOne: verifiedUserBuyerAAddress3.lineOne,
        lineTwo: verifiedUserBuyerAAddress3.lineTwo,
        city: verifiedUserBuyerAAddress3.city,
        region: verifiedUserBuyerAAddress3.region,
        postalCode: verifiedUserBuyerAAddress3.postalCode,
        phoneNumber: verifiedUserBuyerAAddress3.phoneNumber,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
