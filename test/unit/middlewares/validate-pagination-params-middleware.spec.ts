import Koa from 'koa';

import { validatePaginationParams } from '../../../src/middlewares/validate-pagination-params.middleware';
import { ValidationError } from '../../../src/types/errors';

describe('validatePaginationParams', () => {
  describe('should throw validation error', () => {
    test('if limit is an array of numeric strings', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            limit: ['1', '2'],
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      await expect(validatePaginationParams(ctx, next)).rejects.toThrow(
        ValidationError,
      );

      expect(next).not.toHaveBeenCalled();
    });

    test('if limit is a boolean, true', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: true,
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      await expect(validatePaginationParams(ctx, next)).rejects.toThrow(
        ValidationError,
      );

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

      await expect(validatePaginationParams(ctx, next)).rejects.toThrow(
        ValidationError,
      );

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

      await expect(validatePaginationParams(ctx, next)).rejects.toThrow(
        ValidationError,
      );

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

      await expect(validatePaginationParams(ctx, next)).rejects.toThrow(
        ValidationError,
      );

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('should call next', () => {
    test('if offset is a number and limit undefined', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: '1',
          },
        },
      } as unknown as Koa.Context;
      const next = jest.fn();

      await validatePaginationParams(ctx, next);

      expect(next).toHaveBeenCalled();
    });

    test('if offset is undefined and limit a number', async () => {
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

    test('if offset and limit are numbers', async () => {
      const ctx: Koa.Context = {
        request: {
          query: {
            offset: '1',
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
