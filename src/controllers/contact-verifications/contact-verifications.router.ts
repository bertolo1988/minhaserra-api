import Router from 'koa-router';

import { validateIdValidUuid } from '../../middlewares/param-is-valid-uuid.middleware';
import { ContactVerificationsController } from './contact-verifications.controller';

export function configureContactsVerificationRouter(router: Router) {
  router.get(
    '/contact-verifications/:id/verify',
    validateIdValidUuid,
    ContactVerificationsController.verifyUserContact,
  );
}
