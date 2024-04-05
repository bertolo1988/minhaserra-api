import type { Knex } from 'knex';

const LANGUAGES = [
  'pt-PT',
  'en',
  'es',
  'fr',
  'de',
  'it',
  'nl',
  'ja',
  'zh',
  'sv',
];

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE language AS ENUM ('${LANGUAGES.join("','")}');`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TYPE IF EXISTS language;`);
}
