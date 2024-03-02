import Koa from 'koa';
import moment from 'moment';

import CONFIG from '../../config';
import CONSTANTS from '../../constants';
import { PasswordUtils } from '../../utils/password-utils';
import emailServiceInstance from '../emails';
import { PasswordResetTemplateData } from '../emails/email-templates';
import { EmailTemplateType } from '../emails/email.types';
import { UsersRepository } from '../users';
import { PasswordResetsRepository } from './password-resets.repository';

export class PasswordResetsController {
  public static async createPasswordReset(ctx: Koa.Context) {
    try {
      const { email } = ctx.request.body;
      const user = await UsersRepository.getByEmail(email, false);

      if (!user) {
        throw new Error('User does not exist, failed to create password reset');
      }

      const token = PasswordUtils.generateRandomToken(32);
      const expiresAt = moment()
        .add(CONSTANTS.PASSWORD_RESET_EXPIRY_HOURS, 'hours')
        .toDate();

      const passwordResetId = await PasswordResetsRepository.createOne(
        user.id,
        token,
        expiresAt,
      );

      if (!passwordResetId) {
        throw new Error('Failed to create password reset');
      }

      await emailServiceInstance.sendEmail(
        email,
        EmailTemplateType.PASSWORD_RESET,
        {
          expiresAt: expiresAt.toISOString(),
          passwordResetUrl: `${CONFIG.ui.url}/password-reset-form?token=${token}`,
        } as PasswordResetTemplateData,
      );
    } catch (error) {
      console.error(error);
    }
    ctx.status = 200;
    ctx.body = { message: 'Password reset link sent' };
  }
}
