import AWS from 'aws-sdk';

import CONFIG from '../../config';
import { EmailTemplates } from './email-templates';
import { EmailTemplateType } from './email.types';

export default class EmailService {
  noReplyEmailFrom: string;
  ses: AWS.SES;

  constructor() {
    this.noReplyEmailFrom = `${CONFIG.emails.noReplyMail}`;
    this.ses = new AWS.SES({
      apiVersion: '2010-12-01',
      accessKeyId: CONFIG.aws.accessKeyId,
      secretAccessKey: CONFIG.aws.secretAccessKey,
      sslEnabled: true,
      region: CONFIG.aws.region,
    });
  }

  async sendSimpleEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<AWS.SES.SendEmailResponse> {
    const params: AWS.SES.Types.SendEmailRequest = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: this.noReplyEmailFrom,
    };
    return this.ses.sendEmail(params).promise();
  }

  getSubject(template: EmailTemplateType): string {
    return EmailTemplates[template].getSubject();
  }

  getBody(template: EmailTemplateType, data: any): string {
    return EmailTemplates[template].getBody(data);
  }

  async sendEmail(
    to: string,
    template: EmailTemplateType,
    data: Record<string, any>,
  ): Promise<AWS.SES.SendEmailResponse> {
    const subject = this.getSubject(template);
    const body = this.getBody(template, data);
    return this.sendSimpleEmail(to, subject, body);
  }
}
