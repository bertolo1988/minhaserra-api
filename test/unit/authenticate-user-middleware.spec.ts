import Koa from 'koa';
import moment from 'moment';
import tk from 'timekeeper';

import { AuthenticationUtils } from '../../src/middlewares/authenticate-user.middleware';
import { UnauthorizedError } from '../../src/types/errors/unauthorized.error';
import CONFIG from '../../src/config';
import { getAuthorizationHeader } from '../test-utils';
import { verifiedUser } from '../seeds/login.seed';
import { UsersRepository } from '../../src/controllers/users';
import { UserRole, UserState } from '../../src/controllers/users/users.types';

describe('AuthenticationUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('authenticateUserMiddleware', () => {
    describe('should return UnauthorizedError', () => {
      test('when authorization header is not present', async () => {
        const ctx: Koa.Context = {
          request: {
            headers: {},
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authenticateUserMiddleware(ctx, next),
        ).rejects.toThrow(UnauthorizedError);

        expect(next).not.toHaveBeenCalled();
      });

      describe('when Authorization header is malformed', () => {
        test('because it does not have 2 parts', async () => {
          const ctx: Koa.Context = {
            request: {
              headers: {
                authorization: 'Bearer',
              },
            },
          } as Koa.Context;
          const next = jest.fn();

          await expect(
            AuthenticationUtils.authenticateUserMiddleware(ctx, next),
          ).rejects.toThrow(UnauthorizedError);

          expect(next).not.toHaveBeenCalled();
        });

        test('because it is empty string', async () => {
          const ctx: Koa.Context = {
            request: {
              headers: {
                authorization: 'Bearer',
              },
            },
          } as Koa.Context;
          const next = jest.fn();

          await expect(
            AuthenticationUtils.authenticateUserMiddleware(ctx, next),
          ).rejects.toThrow(UnauthorizedError);

          expect(next).not.toHaveBeenCalled();
        });

        test('when token is not verifiable because its malformed', async () => {
          const ctx: Koa.Context = {
            request: {
              headers: {
                authorization: 'Bearer aaa',
              },
            },
          } as Koa.Context;
          const next = jest.fn();

          await expect(
            AuthenticationUtils.authenticateUserMiddleware(ctx, next),
          ).rejects.toThrow(UnauthorizedError);

          expect(next).not.toHaveBeenCalled();
        });
      });

      test('when token is expired', async () => {
        const nowPlusOneMinute = moment().add(1, 'minute');
        const fewHoursAgo = moment().subtract(
          CONFIG.authentication.jwtExpirationHours,
          'hours',
        );
        tk.travel(fewHoursAgo.toDate());
        const expiredAuthorizationHeader = getAuthorizationHeader(verifiedUser);
        tk.travel(nowPlusOneMinute.toDate());

        const ctx: Koa.Context = {
          request: {
            headers: {
              authorization: expiredAuthorizationHeader,
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        try {
          await AuthenticationUtils.authenticateUserMiddleware(ctx, next);
          expect(1).toBe(2);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(UnauthorizedError);
          expect((err as any).message).toBe('Authorization expired');
        }

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is not found', async () => {
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue(null);

        const ctx: Koa.Context = {
          request: {
            headers: {
              authorization: getAuthorizationHeader(verifiedUser),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authenticateUserMiddleware(ctx, next),
        ).rejects.toThrow(UnauthorizedError);

        expect(getUserByIdMock).toHaveBeenCalledWith(verifiedUser.id);
        expect(next).not.toHaveBeenCalled();
      });

      test('when user is deleted', async () => {
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue({ ...verifiedUser, isDeleted: true });

        const ctx: Koa.Context = {
          request: {
            headers: {
              authorization: getAuthorizationHeader(verifiedUser),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authenticateUserMiddleware(ctx, next),
        ).rejects.toThrow(UnauthorizedError);

        expect(getUserByIdMock).toHaveBeenCalledWith(verifiedUser.id);
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('should authenticate the user', () => {
      test('when an active and verified user with role buyer is found', async () => {
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue(verifiedUser);

        const ctx: Koa.Context = {
          state: {},
          request: {
            headers: {
              authorization: getAuthorizationHeader(verifiedUser),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authenticateUserMiddleware(ctx, next);

        expect(getUserByIdMock).toHaveBeenCalledWith(verifiedUser.id);
        expect(next).toHaveBeenCalled();

        expect(ctx.state.user).toEqual(verifiedUser);
        expect(ctx.state.user.role).toEqual(UserRole.BUYER);
        expect(ctx.state.userState).toContain(UserState.ACTIVE);
        expect(ctx.state.userState).toContain(UserState.VERIFIED);
      });

      test('when an active and verified user with role admin is found', async () => {
        const user = { ...verifiedUser, role: UserRole.ADMIN };
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue(user);

        const ctx: Koa.Context = {
          state: {},
          request: {
            headers: {
              authorization: getAuthorizationHeader(user),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authenticateUserMiddleware(ctx, next);

        expect(getUserByIdMock).toHaveBeenCalledWith(user.id);
        expect(next).toHaveBeenCalled();

        expect(ctx.state.user).toEqual(user);
        expect(ctx.state.userState).toContain(UserState.ACTIVE);
        expect(ctx.state.userState).toContain(UserState.VERIFIED);
      });

      test('when an active and verified user with role seller is found', async () => {
        const user = { ...verifiedUser, role: UserRole.SELLER };
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue(user);

        const ctx: Koa.Context = {
          state: {},
          request: {
            headers: {
              authorization: getAuthorizationHeader(user),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authenticateUserMiddleware(ctx, next);

        expect(getUserByIdMock).toHaveBeenCalledWith(user.id);
        expect(next).toHaveBeenCalled();

        expect(ctx.state.user).toEqual(user);
        expect(ctx.state.userState).toContain(UserState.ACTIVE);
        expect(ctx.state.userState).toContain(UserState.VERIFIED);
      });

      test('when an active and verified user with role moderator is found', async () => {
        const user = { ...verifiedUser, role: UserRole.MODERATOR };
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue(user);

        const ctx: Koa.Context = {
          state: {},
          request: {
            headers: {
              authorization: getAuthorizationHeader(user),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authenticateUserMiddleware(ctx, next);

        expect(getUserByIdMock).toHaveBeenCalledWith(user.id);
        expect(next).toHaveBeenCalled();

        expect(ctx.state.user).toEqual(user);
        expect(ctx.state.userState).toContain(UserState.ACTIVE);
        expect(ctx.state.userState).toContain(UserState.VERIFIED);
      });
    });
  });
});
