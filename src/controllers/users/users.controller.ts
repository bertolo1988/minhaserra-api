import Koa from 'koa';
import moment from 'moment';
import CONFIG from '../../config';
import CONSTANTS from '../../constants';
import { ForbiddenError } from '../../types/errors';
import { JwtUtils } from '../../utils/jwt-utils';
import { KoaUtils } from '../../utils/koa-utils';
import { PasswordUtils } from '../../utils/password-utils';
import { ContactVerificationsRepository } from '../contact-verifications';
import {
  ContactVerifiationType,
  ContactVerificationDto,
} from '../contact-verifications/contact-verifications.types';
import emailServiceInstance from '../emails';
import { EmailVerficationTemplateData } from '../emails/email-templates';
import { EmailTemplateType } from '../emails/email.types';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UpdateUserDto, UserDto } from './users.types';
import { isUpdateSuccessfull } from '../../knex-database';
import { AddressesRepository } from '../addresses/addresses.repository';

export class UsersController {
  static async createUser(ctx: Koa.Context, _next: Koa.Next) {
    const dto = ctx.request.body as UserDto;

    const userExists = await UsersRepository.getByEmail(dto.email);
    if (userExists != null) {
      ctx.status = 409;
      ctx.body = { message: 'User with this email already exists' };
      return;
    }

    const { id: userId } = await UsersRepository.createOne(dto);
    const expiresAt = moment().add(
      CONSTANTS.CONTACT_VERIFICATION_EXPIRY_HOURS,
      'hours',
    );

    const contactVerificationDto: ContactVerificationDto = {
      userId,
      type: ContactVerifiationType.EMAIL,
      contact: dto.email,
      expiresAt: expiresAt.toDate(),
    };
    const { id: contactVerificationId } =
      await ContactVerificationsRepository.createOne(contactVerificationDto);

    if (!contactVerificationId) {
      throw new Error(
        `Failed to create contact verification for user ${userId} with email ${dto.email}`,
      );
    }

    await emailServiceInstance.sendEmail(
      dto.email,
      EmailTemplateType.USER_EMAIL_VERIFICATION,
      {
        expiresAt: expiresAt.format('Do MMMM YYYY, HH:mm'),
        verificationUrl: `${CONFIG.server.url}/api/contact-verifications/${contactVerificationId}/verify`,
      } as EmailVerficationTemplateData,
    );

    ctx.status = 201;
    ctx.body = { id: userId };
  }

  static async loginUser(ctx: Koa.Context, _next: Koa.Next) {
    const { email, password } = ctx.request.body;
    const user = await UsersRepository.getVerifiedActiveUserByEmail(email);

    if (!user) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized' };
      return;
    }

    const isPasswordMatch = PasswordUtils.matchPassword(password, {
      hash: user.passwordHash,
      salt: user.passwordSalt,
      iterations: user.passwordIterations,
    });

    if (!isPasswordMatch) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized' };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      id: user.id,
      token: JwtUtils.sign({
        id: user.id,
        role: user.role,
        email: user.email,
      }),
    };
  }

  static async getUserById(ctx: Koa.Context, _next: Koa.Next) {
    const { id } = ctx.params;

    if (!KoaUtils.isUserAdminOrModerator(ctx) && id != ctx.state.user.id) {
      throw new ForbiddenError('You are not allowed to access this resource');
    }

    const user = await UsersRepository.getById(id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = UsersMapper.mapUserModelToPresentedUserModel(user);
  }

  static async updateUser(ctx: Koa.Context, _next: Koa.Next) {
    const userId: string = ctx.params.id;
    const dto: UpdateUserDto = ctx.request.body as UpdateUserDto;

    if (!KoaUtils.isUserAdminOrModerator(ctx) && userId != ctx.state.user.id) {
      throw new ForbiddenError('You are not allowed to access this resource');
    }

    if (dto.invoiceAddressId) {
      const invoiceAddress = await AddressesRepository.getUserAddressById(
        dto.invoiceAddressId,
        userId,
      );
      if (!invoiceAddress) {
        ctx.status = 404;
        ctx.body = { message: 'Invoice address not found' };
        return;
      }
    }

    if (dto.shippingAddressId) {
      const shippingAddress = await AddressesRepository.getUserAddressById(
        dto.shippingAddressId,
        userId,
      );
      if (!shippingAddress) {
        ctx.status = 404;
        ctx.body = { message: 'Shipping address not found' };
        return;
      }
    }

    const updateResult = await UsersRepository.updateOneUserById(userId, dto);
    if (isUpdateSuccessfull(updateResult)) {
      ctx.status = 200;
      ctx.body = { message: 'User successfully updated' };
      return;
    }
    throw new Error('Failed to update user');
  }
}
