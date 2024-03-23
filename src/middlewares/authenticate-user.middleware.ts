import Koa from 'koa';
import { UsersRepository } from '../controllers/users';
import {
  UserModel,
  UserRole,
  UserState,
} from '../controllers/users/users.types';
import { ForbiddenError, UnauthorizedError } from '../types/errors';
import { CustomJwtPayload, JwtUtils } from '../utils/jwt-utils';

export class AuthenticationUtils {
  public static async authenticateUserMiddleware(
    ctx: Koa.Context,
    next: Koa.Next,
  ): Promise<void> {
    const authorizationHeader = ctx.request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedError();
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError();
    }

    const user: CustomJwtPayload = await JwtUtils.verify(token);

    const userModel = await UsersRepository.getById(user.id);
    if (!userModel) {
      console.error(`User with id ${user.id} had valid JWT but was not found`);
      throw new UnauthorizedError();
    }

    if (userModel.isDeleted) {
      throw new UnauthorizedError();
    }

    ctx.state.user = userModel;
    ctx.state.userState = AuthenticationUtils.getUserState(userModel);
    await next();
  }

  public static authorizeActiveVerifiedUsers(): (
    ctx: Koa.Context,
    next: Koa.Next,
  ) => Promise<void> {
    return AuthenticationUtils.authorizeUserMiddleware(
      Object.values(UserRole),
      [UserState.DELETED, UserState.INACTIVE, UserState.UNVERIFIED],
    );
  }

  public static authorizeAdmins(): (
    ctx: Koa.Context,
    next: Koa.Next,
  ) => Promise<void> {
    return AuthenticationUtils.authorizeUserMiddleware(
      [UserRole.ADMIN],
      [UserState.DELETED, UserState.INACTIVE, UserState.UNVERIFIED],
    );
  }

  public static authorizeAdminsAndModerators(): (
    ctx: Koa.Context,
    next: Koa.Next,
  ) => Promise<void> {
    return AuthenticationUtils.authorizeUserMiddleware(
      [UserRole.ADMIN, UserRole.MODERATOR],
      [UserState.DELETED, UserState.INACTIVE, UserState.UNVERIFIED],
    );
  }

  private static authorizeUserMiddleware(
    allowedRoles: UserRole[],
    disallowedUserStates: UserState[] = [
      UserState.DELETED,
      UserState.INACTIVE,
      UserState.UNVERIFIED,
    ],
  ): (ctx: Koa.Context, next: Koa.Next) => Promise<void> {
    return async (ctx: Koa.Context, next: Koa.Next) => {
      const user: UserModel = ctx.state.user as UserModel;

      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenError();
      }

      if (
        disallowedUserStates.some((state) =>
          ctx.state.userState.includes(state),
        )
      ) {
        throw new ForbiddenError();
      }

      await next();
    };
  }

  private static getUserState(user: UserModel): UserState[] {
    const userStates = [];
    if (user.isDeleted) {
      userStates.push(UserState.DELETED);
    }

    if (user.isActive) {
      userStates.push(UserState.ACTIVE);
    } else {
      userStates.push(UserState.INACTIVE);
    }

    if (user.isEmailVerified) {
      userStates.push(UserState.VERIFIED);
    } else {
      userStates.push(UserState.UNVERIFIED);
    }

    return userStates;
  }
}
