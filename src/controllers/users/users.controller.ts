import Koa from 'koa';
import { UsersRepository } from './users.repository';
import { UserDto } from './users.types';

export class UsersController {
  static async createUser(ctx: Koa.Context, next: Koa.Next) {
    const { id } = await UsersRepository.createOne(ctx.request.body as UserDto);
    ctx.status = 201;
    ctx.body = { id };
  }
}
