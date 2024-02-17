import Koa from 'koa';

export class UsersValidator {
  static async validateCreateUser(ctx: Koa.Context, next: Koa.Next) {
    await next();
  }
}
