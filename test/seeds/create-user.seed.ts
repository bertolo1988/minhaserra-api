import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('contact_verifications').del();
}
