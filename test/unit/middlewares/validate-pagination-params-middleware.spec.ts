import Koa from 'koa';

import { validatePaginationParams } from '../../../src/middlewares/validate-pagination-params.middleware';
import { ValidationError } from '../../../src/types/errors';
import CONSTANTS from '../../../src/constants';

describe('validatePaginationParams', () => {
  describe('should throw validation error', () => {
    test('if limit is not a multiple of 10', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            limit: '9',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          "'limit' must be multiple of 10",
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });

    test('if offset is not a multiple of 10', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: '9',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          "'offset' must be multiple of 10",
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });

    test('if limit is above maximum limit', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            limit: `${CONSTANTS.MAX_PAGINATION_LIMIT + 1}`,
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          `'limit' must be less than 30`,
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });

    test('if limit is an array of numeric strings', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            limit: ['1', '2'],
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          "Invalid query parameter 'limit'",
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });

    test('if offset is a boolean, true', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: true,
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          "Invalid query parameter 'offset'",
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });

    test('if offset is a boolean, false', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: false,
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          "Invalid query parameter 'offset'",
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });

    test('if offset a non numeric string', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: 'aaa',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          "Invalid query parameter 'offset'",
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });

    test('if limit is a uuid', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            limit: '53bad12c-99fa-4f9f-992d-1c91db0002d8',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      try {
        await validatePaginationParams(ctx, next);
        expect(true).toBe(false);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        expect(err).toHaveProperty(
          'validationErrors',
          "Invalid query parameter 'limit'",
        );
        expect(err).toHaveProperty('statusCode', 400);
        expect(err).toHaveProperty('name', 'ValidationError');
        expect(err).toHaveProperty('message', 'Validation error');
        expect((err as any).stack).toBeDefined();
      }

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('should call next', () => {
    test('if offset is a number multiple of 10 and limit undefined', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: '100',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      await validatePaginationParams(ctx, next);

      expect(next).toHaveBeenCalled();
    });

    test('if offset is undefined and limit a number multiple of 10', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            limit: '10',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      await validatePaginationParams(ctx, next);

      expect(next).toHaveBeenCalled();
    });

    test('if offset and limit are both numbers multiples of 10', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: '0',
            limit: '10',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      await validatePaginationParams(ctx, next);

      expect(next).toHaveBeenCalled();
    });

    test('if offset and limit are both not defined', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {},
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      await validatePaginationParams(ctx, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
