import Koa from 'koa';
import moment from 'moment';
import tk from 'timekeeper';

import CONFIG from '../../../src/config';
import { UsersRepository } from '../../../src/controllers/users';
import {
  UserRole,
  UserState,
} from '../../../src/controllers/users/users.types';
import { AuthenticationUtils } from '../../../src/middlewares/authenticate-user.middleware';
import { ForbiddenError, UnauthorizedError } from '../../../src/types/errors';
import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedUserBuyer,
} from '../../seeds/multiple-users.seed';
import { getAuthorizationHeader } from '../../test-utils';

describe('AuthenticationUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('authenticateUserMiddleware', () => {
    describe('should throw UnauthorizedError', () => {
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
        const expiredAuthorizationHeader =
          getAuthorizationHeader(verifiedUserBuyer);
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
              authorization: getAuthorizationHeader(verifiedUserBuyer),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authenticateUserMiddleware(ctx, next),
        ).rejects.toThrow(UnauthorizedError);

        expect(getUserByIdMock).toHaveBeenCalledWith(verifiedUserBuyer.id);
        expect(next).not.toHaveBeenCalled();
      });

      test('when user is deleted', async () => {
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue({ ...verifiedUserBuyer, isDeleted: true });

        const ctx: Koa.Context = {
          request: {
            headers: {
              authorization: getAuthorizationHeader(verifiedUserBuyer),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authenticateUserMiddleware(ctx, next),
        ).rejects.toThrow(UnauthorizedError);

        expect(getUserByIdMock).toHaveBeenCalledWith(verifiedUserBuyer.id);
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('should authenticate the user', () => {
      test('when an active and verified user with role buyer is found', async () => {
        const getUserByIdMock = jest
          .spyOn(UsersRepository, 'getById')
          .mockResolvedValue(verifiedUserBuyer);

        const ctx: Koa.Context = {
          state: {},
          request: {
            headers: {
              authorization: getAuthorizationHeader(verifiedUserBuyer),
            },
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authenticateUserMiddleware(ctx, next);

        expect(getUserByIdMock).toHaveBeenCalledWith(verifiedUserBuyer.id);
        expect(next).toHaveBeenCalled();

        expect(ctx.state.user).toEqual(verifiedUserBuyer);
        expect(ctx.state.user.role).toEqual(UserRole.BUYER);
        expect(ctx.state.userState).toContain(UserState.ACTIVE);
        expect(ctx.state.userState).toContain(UserState.VERIFIED);
      });

      test('when an active and verified user with role admin is found', async () => {
        const user = { ...verifiedUserBuyer, role: UserRole.ADMIN };
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
        const user = { ...verifiedUserBuyer, role: UserRole.SELLER };
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
        const user = { ...verifiedUserBuyer, role: UserRole.MODERATOR };
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

  describe('authorizeActiveVerifiedUsers', () => {
    describe('should throw ForbiddenError', () => {
      test('when user is inactive', async () => {
        const ctx: Koa.Context = {
          state: {
            user: inactiveUser,
            userState: [UserState.INACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeActiveVerifiedUsers()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is unverified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: unverifiedUser,
            userState: [UserState.UNVERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeActiveVerifiedUsers()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is deleted', async () => {
        const ctx: Koa.Context = {
          state: {
            user: softDeletedUser,
            userState: [UserState.DELETED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeActiveVerifiedUsers()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('should authorize the user', () => {
      test('when user, with role buyer, is active and verified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: verifiedUserBuyer,
            userState: [UserState.ACTIVE, UserState.VERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authorizeActiveVerifiedUsers()(ctx, next);

        expect(next).toHaveBeenCalled();
      });

      test('when user, with role seller, is active and verified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.SELLER },
            userState: [UserState.ACTIVE, UserState.VERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authorizeActiveVerifiedUsers()(ctx, next);

        expect(next).toHaveBeenCalled();
      });

      test('when user, with role moderator, is active and verified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.MODERATOR },
            userState: [UserState.ACTIVE, UserState.VERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authorizeActiveVerifiedUsers()(ctx, next);

        expect(next).toHaveBeenCalled();
      });

      test('when user, with role admin, is active and verified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.ADMIN },
            userState: [UserState.ACTIVE, UserState.VERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authorizeActiveVerifiedUsers()(ctx, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe('authorizeAdmins', () => {
    describe('should throw ForbiddenError', () => {
      test('when user is inactive', async () => {
        const ctx: Koa.Context = {
          state: {
            user: inactiveUser,
            userState: [UserState.INACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdmins()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is unverified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: {
              ...verifiedUserBuyer,
              isEmailVerified: false,
              role: UserRole.ADMIN,
            },
            userState: [UserState.UNVERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdmins()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is deleted', async () => {
        const ctx: Koa.Context = {
          state: {
            user: {
              ...verifiedUserBuyer,
              isDeleted: true,
              role: UserRole.ADMIN,
            },
            userState: [UserState.DELETED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdmins()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is moderator', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.MODERATOR },
            userState: [UserState.VERIFIED, UserState.ACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdmins()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is seller', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.SELLER },
            userState: [UserState.VERIFIED, UserState.ACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdmins()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is buyer', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.BUYER },
            userState: [UserState.VERIFIED, UserState.ACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdmins()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('should authorize the user', () => {
      test('when user, with role admin, is active and verified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.ADMIN },
            userState: [UserState.ACTIVE, UserState.VERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authorizeAdmins()(ctx, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe('authorizeAdminsAndModerators', () => {
    describe('should throw ForbiddenError', () => {
      test('when user is inactive', async () => {
        const ctx: Koa.Context = {
          state: {
            user: inactiveUser,
            userState: [UserState.INACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdminsAndModerators()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is unverified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: {
              ...verifiedUserBuyer,
              isEmailVerified: false,
              role: UserRole.ADMIN,
            },
            userState: [UserState.UNVERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdminsAndModerators()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is deleted', async () => {
        const ctx: Koa.Context = {
          state: {
            user: {
              ...verifiedUserBuyer,
              isDeleted: true,
              role: UserRole.ADMIN,
            },
            userState: [UserState.DELETED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdminsAndModerators()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is seller', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.SELLER },
            userState: [UserState.VERIFIED, UserState.ACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdminsAndModerators()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });

      test('when user is buyer', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.BUYER },
            userState: [UserState.VERIFIED, UserState.ACTIVE],
          },
        } as Koa.Context;
        const next = jest.fn();

        await expect(
          AuthenticationUtils.authorizeAdminsAndModerators()(ctx, next),
        ).rejects.toThrow(ForbiddenError);

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('should authorize the user', () => {
      test('when user, with role admin, is active and verified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.ADMIN },
            userState: [UserState.ACTIVE, UserState.VERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authorizeAdminsAndModerators()(ctx, next);

        expect(next).toHaveBeenCalled();
      });

      test('when user, with role moderator, is active and verified', async () => {
        const ctx: Koa.Context = {
          state: {
            user: { ...verifiedUserBuyer, role: UserRole.MODERATOR },
            userState: [UserState.ACTIVE, UserState.VERIFIED],
          },
        } as Koa.Context;
        const next = jest.fn();

        await AuthenticationUtils.authorizeAdminsAndModerators()(ctx, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });
});
