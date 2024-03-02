import { EmailTemplateType } from './email.types';

export interface EmailTemplate {
  getSubject: () => string;
  getBody: (data: any) => string;
}

export type EmailVerficationTemplateData = {
  verificationUrl: string;
};

export class EmailVerficationTemplate implements EmailTemplate {
  getSubject(): string {
    return 'Verify your email';
  }

  getBody(data: EmailVerficationTemplateData): string {
    return `<p>Click <a href="${data.verificationUrl}">here</a> to verify your email</p>`;
  }
}

export type PasswordResetTemplateData = {
  passwordResetUrl: string;
  expiresAt: string;
};

export class PasswordResetTemplate implements EmailTemplate {
  getSubject(): string {
    return 'Reset your password';
  }

  getBody(data: PasswordResetTemplateData): string {
    return `<p>Click <a href="${data.passwordResetUrl}">here</a> to reset your password</p>
    <p>This link will expire at ${data.expiresAt}</p>`;
  }
}

export const EmailTemplates = {
  [EmailTemplateType.USER_EMAIL_VERIFICATION]: new EmailVerficationTemplate(),
  [EmailTemplateType.PASSWORD_RESET]: new PasswordResetTemplate(),
};
