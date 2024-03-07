import moment from 'moment';
import tk from 'timekeeper';
import CONFIG from '../../../src/config';
import { verifiedUser } from '../../seeds/login.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('GET /api/users/:id', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.LOGIN);
  });

  describe('should return 400', () => {
    test('if id is not valid uuid', async () => {
      const id = 'not-valid-uuid';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUser),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid id: ${id}`);
    });
  });

  describe('should return 401', () => {
    test('if authorization header is not provided', async () => {
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if authorization header is il formed', async () => {
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer invalid-token',
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if authorization header does not have 2 parts separated by space', async () => {
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: 'Bearerinvalid-token',
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if authorization header is expired', async () => {
      const nowPlusOneMinute = moment().add(1, 'minute');
      const fewHoursAgo = moment().subtract(
        CONFIG.authentication.jwtExpirationHours,
        'hours',
      );
      tk.travel(fewHoursAgo.toDate());
      const expiredAuthorizationHeader = getAuthorizationHeader(verifiedUser);
      tk.travel(nowPlusOneMinute.toDate());
      const id = 'df8d4677-09dd-41bc-a283-377d502f693e';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: expiredAuthorizationHeader,
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Authorization expired`);
    });

    test.skip('if user is deleted', async () => {
      // TODO
    });
  });

  describe.skip('should return 403', () => {
    test.skip('if user is inactive', async () => {
      // TODO
    });

    test.skip('if user is unverified', async () => {
      // TODO
    });

    test.skip('if user is buyer and provides id different than his own', async () => {
      const id = 'not-valid-uuid';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUser),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid id: ${id}`);
    });

    test.skip('if user is seller and provides id different than his own', async () => {
      const id = 'not-valid-uuid';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          Authorization: getAuthorizationHeader(verifiedUser),
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid id: ${id}`);
    });
  });

  describe.skip('should return 200', () => {
    test('if the credentials are correct for a verified user', async () => {
      const id = 'not-valid-uuid';
      const response = await fetch(getTestServerUrl(`/api/users/${id}`).href, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      console.log(2222, body);
    });
  });
});
