import Koa from 'koa';

export class UsersController {
  static async createUser(ctx: Koa.Context, next: Koa.Next) {
    ctx.status = 201;
    ctx.body = { message: 'User created!' };
    await next();
  }
}
