import Koa from 'koa';
import { ContactVerificationsRepository } from './contact-verifications.repository';

export class ContactVerificationsController {
  static async verifyUserContact(ctx: Koa.Context, _next: Koa.Next) {
    const { id } = ctx.params;
    const now = new Date();
    const contactVerification =
      await ContactVerificationsRepository.getByIdAndExpiration(id, now);

    if (contactVerification) {
      await ContactVerificationsRepository.setUserEmailVerified(
        contactVerification,
      );
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }
  }
}
