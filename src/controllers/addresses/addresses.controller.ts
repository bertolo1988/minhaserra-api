import Koa from 'koa';
import CONSTANTS from '../../constants';
import { ValidationError } from '../../types/errors';
import { AddressesRepository } from './addresses.repository';
import { CreateAddressDto } from './addresses.types';
import { isDeleteSuccessfull } from '../../knex-database';

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
    const userId = ctx.state.user.id as string;

    const addresses = await AddressesRepository.getAddressesByUserId(userId);
    ctx.status = 200;
    ctx.body = addresses;
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

  static async deleteOneAddress(ctx: Koa.Context, _next: Koa.Next) {
    const { id } = ctx.params;
    const userId = ctx.state.user.id as string;

    const deleteResult = await AddressesRepository.deleteOneAddressById(
      id,
      userId,
    );
    if (isDeleteSuccessfull(deleteResult)) {
      ctx.status = 200;
      ctx.body = { message: 'Address deleted successfully' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Address not found' };
    }
  }
}
