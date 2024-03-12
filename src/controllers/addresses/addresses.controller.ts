import Koa from 'koa';

export class AddressesController {
  static async getAddresses(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'getAddresses';
  }

  static async getOneAddress(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'getOneAddress';
  }

  static async createAddress(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'createAddress';
  }

  static async updateAddress(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'updateAddress';
  }

  static async deleteAddress(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'deleteAddress';
  }
}
