import Koa from 'koa';
import { UserRole } from '../controllers/users/users.types';

export class KoaUtils {
  static isUserAdmin(ctx: Koa.Context): boolean {
    return ctx.state.user && ctx.state.user.role === UserRole.ADMIN;
  }

  static isUserModerator(ctx: Koa.Context): boolean {
    return ctx.state.user && ctx.state.user.role === UserRole.MODERATOR;
  }

  static isUserAdminOrModerator(ctx: Koa.Context): boolean {
    return (
      ctx.state.user &&
      (ctx.state.user.role === UserRole.ADMIN ||
        ctx.state.user.role === UserRole.MODERATOR)
    );
  }

  static isUserBuyerOrSeller(ctx: Koa.Context): boolean {
    return (
      ctx.state.user &&
      (ctx.state.user.role === UserRole.BUYER ||
        ctx.state.user.role === UserRole.SELLER)
    );
  }
}
