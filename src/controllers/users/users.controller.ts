import Koa from 'koa';
import moment from 'moment';
import CONSTANTS from '../../constants';
import { PasswordUtils } from '../../utils/password-utils';
import { ContactVerificationsRepository } from '../contact-verifications';
import {
  ContactVerifiationType,
  ContactVerificationDto,
} from '../contact-verifications/contact-verifications.types';
import emailServiceInstance from '../emails';
import { EmailTemplateType } from '../emails/email.types';
import { UsersRepository } from './users.repository';
import { UserDto } from './users.types';
import CONFIG from '../../config';

export class UsersController {
  static async createUser(ctx: Koa.Context, _next: Koa.Next) {
    const dto = ctx.request.body as UserDto;
    const { id: userId } = await UsersRepository.createOne(dto);

    const contactVerificationDto: ContactVerificationDto = {
      userId,
      type: ContactVerifiationType.EMAIL,
      contact: dto.email,
      expiresAt: moment()
        .add(CONSTANTS.CONTACT_VERIFICATION_EXPIRY_HOURS, 'hours')
        .toDate(),
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
        verificationUrl: `${CONFIG.server.url}/api/contact-verifications/${contactVerificationId}/verify`,
      },
    );

    ctx.status = 201;
    ctx.body = { id: userId };
  }

  static async loginUser(ctx: Koa.Context, _next: Koa.Next) {
    const { email, password } = ctx.request.body;
    const user = await UsersRepository.getByEmail(email);

    if (!user) {
      ctx.status = 401;
      ctx.body = { message: 'Invalid email or password' };
      return;
    }

    const isPasswordMatch = PasswordUtils.matchPassword(password, {
      hash: user.passwordHash,
      salt: user.passwordSalt,
      iterations: user.passwordIterations,
    });

    if (!isPasswordMatch) {
      ctx.status = 401;
      ctx.body = { message: 'Invalid email or password' };
      return;
    }

    return {
      token: 'aaa',
    };
  }
}
