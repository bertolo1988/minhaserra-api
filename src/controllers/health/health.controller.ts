import Koa from 'koa';

export class HealthController {
  static async hello(ctx: Koa.Context, next: Koa.Next) {
    ctx.status = 200;
    ctx.body = { message: 'hello!' };
    await next();
  }
}
