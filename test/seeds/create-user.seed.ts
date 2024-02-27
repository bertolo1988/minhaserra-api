import { Knex } from 'knex';
import moment from 'moment';

const now = moment();

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('contact_verifications').del();
}
