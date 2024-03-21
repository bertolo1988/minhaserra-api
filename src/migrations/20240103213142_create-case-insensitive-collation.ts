import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(
    `CREATE COLLATION case_insensitive (provider = icu, locale = 'und-u-ks-level2',deterministic = false);`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP COLLATION IF EXISTS case_insensitive;');
}
