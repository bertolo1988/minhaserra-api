import Koa from 'koa';
import moment from 'moment';
import { ContactVerificationsRepository } from '../contact-verifications/contact-verifications.repository';
import {
  ContactVerifiationType,
  ContactVerificationDto,
} from '../contact-verifications/contact-verifications.types';
import { UsersRepository } from './users.repository';
import { UserDto } from './users.types';
import { generateRandomToken } from '../../utils/password-utils';

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

    // TODO:send with contactVerification
    // console.log(1111, contactVerification);
    ctx.status = 201;
    ctx.body = { id: userId };
  }
}
