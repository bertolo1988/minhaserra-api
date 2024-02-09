import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'buyer', 'seller');`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TYPE IF EXISTS user_role;`);
}
