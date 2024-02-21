import { EmailTemplateType } from './email.types';

export interface EmailTemplate {
  getSubject: () => string;
  getBody: (data: any) => string;
}

export class EmailVerficationTemplate implements EmailTemplate {
  getSubject(): string {
    return 'Verify your email';
  }

  getBody(data: { verificationUrl: string }): string {
    return `<p>Click <a href="${data.verificationUrl}">here</a> to verify your email</p>`;
  }
}

export class PasswordResetTemplate implements EmailTemplate {
  getSubject(): string {
    return 'Reset your password';
  }

  getBody(data: { passwordResetUrl: string }): string {
    return `<p>Click <a href="${data.passwordResetUrl}">here</a> to reset your password</p>`;
  }
}

export const EmailTemplates = {
  [EmailTemplateType.USER_EMAIL_VERIFICATION]: new EmailVerficationTemplate(),
  [EmailTemplateType.PASSWORD_RESET]: new PasswordResetTemplate(),
};
