import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE contact_type AS ENUM ('email', 'phone');`);
  await knex.schema.raw(`CREATE TABLE contact_verification (
    id serial4 NOT NULL,
    user_id serial4 NOT NULL,
    "type" "contact_type" NOT NULL DEFAULT 'email'::contact_type,
    contact varchar(100) NOT NULL COLLATE "case_insensitive",
    token varchar(100) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_verification_pkey PRIMARY KEY (id),
    CONSTRAINT contact_verification_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contact_verification');
  await knex.raw(`DROP TYPE IF EXISTS contact_type;`);
}
