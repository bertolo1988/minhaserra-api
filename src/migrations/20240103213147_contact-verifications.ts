import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE TYPE contact_verifications_type AS ENUM ('email', 'phone');`,
  );
  await knex.schema.raw(`CREATE TABLE contact_verifications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    "type" "contact_verifications_type" NOT NULL DEFAULT 'email'::contact_verifications_type,
    contact varchar(100) NOT NULL COLLATE "case_insensitive",
    token varchar(64) NOT NULL,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_verifications_pkey PRIMARY KEY (id),
    CONSTRAINT contact_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contact_verifications');
  await knex.raw(`DROP TYPE IF EXISTS contact_verifications_type;`);
}
