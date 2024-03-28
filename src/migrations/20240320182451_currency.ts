import type { Knex } from 'knex';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD'];

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE currency AS ENUM ('${CURRENCIES.join("','")}');`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TYPE IF EXISTS currency;`);
}
