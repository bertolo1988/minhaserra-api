import Koa from 'koa';

export class UsersValidator {
  static async validateCreateUser(ctx: Koa.Context, next: Koa.Next) {
    ctx.status = 201;
    ctx.body = { message: 'User created!' };
    await next();
  }
}
