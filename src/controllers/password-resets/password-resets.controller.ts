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
import { PasswordResetModel } from './password-resets.types';

export class PasswordResetsController {
  public static async createPasswordReset(ctx: Koa.Context) {
    try {
      const { email } = ctx.request.body;
      const user = await UsersRepository.getVerifiedActiveUserByEmail(email);

      if (!user) {
        throw new Error('User does not exist, failed to create password reset');
      }

      const token = PasswordUtils.generateRandomToken(
        CONSTANTS.PASSWORD_RESET_TOKEN_LENGTH,
      );
      const expiresAt = moment().add(
        CONSTANTS.PASSWORD_RESET_EXPIRY_HOURS,
        'hours',
      );

      const { id: passwordResetId } = await PasswordResetsRepository.createOne(
        user.id,
        token,
        expiresAt.toDate(),
      );

      if (!passwordResetId) {
        throw new Error('Failed to create password reset');
      }

      await emailServiceInstance.sendEmail(
        email,
        EmailTemplateType.PASSWORD_RESET,
        {
          expiresAt: expiresAt.format('Do MMMM YYYY, HH:mm'),
          passwordResetUrl: `${CONFIG.ui.url}/password-reset-form?token=${token}&id=${passwordResetId}`,
        } as PasswordResetTemplateData,
      );
    } catch (error) {
      console.error(error);
    }
    ctx.status = 200;
    ctx.body = { message: 'Password reset link sent' };
  }

  static async updatePasswordUnauthenticated(ctx: Koa.Context) {
    const { id } = ctx.params;
    const { token, password } = ctx.request.body;
    const now = new Date();

    const passwordReset =
      await PasswordResetsRepository.getUnusedByTokenAndExpiration(
        id,
        token,
        now,
      );

    if (!passwordReset) {
      ctx.status = 404;
      ctx.body = { message: 'Password reset not found' };
      return;
    }

    await PasswordResetsRepository.updateUserPassword(
      password,
      passwordReset as PasswordResetModel,
    );

    ctx.status = 200;
    ctx.body = { message: 'Password updated' };
  }
}
