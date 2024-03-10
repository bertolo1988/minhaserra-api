import Router from 'koa-router';

import { ContactVerificationsController } from './contact-verifications.controller';
import { ContactVerificationsValidator } from './contact-verifications.validator';

export function configureContactsVerificationRouter(router: Router) {
  router.get(
    '/contact-verifications/:id/verify',
    ContactVerificationsValidator.validateVerifyUserContact,
    ContactVerificationsController.verifyUserContact,
  );
}
