import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`CREATE TABLE users (
    id serial4 NOT NULL,
    email varchar(100) NOT NULL COLLATE "case_insensitive",
    "role" "user_role" NOT NULL DEFAULT 'buyer'::user_role,
    organization_name varchar(100) NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NULL,
    is_active bool NOT NULL DEFAULT true,
    password_hash varchar(255) NOT NULL,
    terms_version int4 NOT NULL DEFAULT 1,
    last_login_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
  );`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
