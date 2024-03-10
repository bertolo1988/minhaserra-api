import Router from 'koa-router';
import { HealthController } from './health.controller';

export function configureHealthRouter(router: Router) {
  router.get('/health', HealthController.hello);
}
