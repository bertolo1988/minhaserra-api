import Koa from 'koa';
import CONSTANTS from '../../constants';
import { ValidationError } from '../../types/errors';
import { AddressesRepository } from './addresses.repository';
import { CreateAddressDto } from './addresses.types';

export class AddressesController {
  static async createAddress(ctx: Koa.Context, _next: Koa.Next) {
    const dto = ctx.request.body as CreateAddressDto;
    const userId = ctx.state.user.id as string;

    const userAddressesCount =
      await AddressesRepository.countAddressesByUserId(userId);
    if (userAddressesCount >= CONSTANTS.MAX_ADDRESSES_PER_USER) {
      throw new ValidationError(
        'User has reached the maximum amount of addresses',
      );
    }

    const { id: addressId } = await AddressesRepository.createAddress(
      userId,
      dto,
    );

    if (!addressId) {
      throw new Error(`Failed to create address`);
    }

    ctx.status = 201;
    ctx.body = { id: addressId };
  }

  static async getAddresses(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'getAddresses';
  }

  static async getOneAddress(ctx: Koa.Context, _next: Koa.Next) {
    const { id } = ctx.params;
    const userId = ctx.state.user.id as string;

    const address = await AddressesRepository.getUserAddressById(id, userId);
    if (!address) {
      ctx.status = 404;
      ctx.body = { message: 'Address not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = address;
  }

  static async updateAddress(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'updateAddress';
  }

  static async deleteAddress(ctx: Koa.Context, _next: Koa.Next) {
    ctx.body = 'deleteAddress';
  }
}
