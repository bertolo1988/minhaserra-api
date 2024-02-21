import Koa from 'koa';
import moment from 'moment';
import { generateRandomToken } from '../../utils/password-utils';
import { ContactVerificationsRepository } from '../contact-verifications/contact-verifications.repository';
import {
  ContactVerifiationType,
  ContactVerificationDto,
} from '../contact-verifications/contact-verifications.types';
import emailServiceInstance from '../emails';
import { EmailTemplateType } from '../emails/email.types';
import { UsersRepository } from './users.repository';
import { UserDto } from './users.types';

export class UsersController {
  static async createUser(ctx: Koa.Context, _next: Koa.Next) {
    const dto = ctx.request.body as UserDto;
    const { id: userId } = await UsersRepository.createOne(dto);

    const contactVerificationDto: ContactVerificationDto = {
      userId,
      type: ContactVerifiationType.EMAIL,
      contact: dto.email,
      token: generateRandomToken(64),
      expiresAt: moment().add(3, 'hours').toDate(),
    };
    const { id: contactVerificationId } =
      await ContactVerificationsRepository.createOne(contactVerificationDto);
    const contactVerification = await ContactVerificationsRepository.getById(
      contactVerificationId,
    );

    if (!contactVerification) {
      throw new Error(
        `Contact verification not found with id:${contactVerificationId}`,
      );
    }

    await emailServiceInstance.sendEmail(
      dto.email,
      EmailTemplateType.USER_EMAIL_VERIFICATION,
      {
        verificationUrl: `${process.env.SERVER_BASE_URL}/contact-verifications/${contactVerification?.token}`,
      },
    );

    ctx.status = 201;
    ctx.body = { id: userId };
  }
}
