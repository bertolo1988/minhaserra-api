import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`CREATE TABLE password_resets (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    token varchar(64) NOT NULL,
    verified_at timestamptz,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT password_resets_pkey PRIMARY KEY (id),
    CONSTRAINT password_resets_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('password_resets');
}
