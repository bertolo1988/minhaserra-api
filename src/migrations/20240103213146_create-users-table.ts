import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`CREATE TABLE users (
    id serial4 NOT NULL,
    email varchar(100) NOT NULL COLLATE "case_insensitive",
    "role" "user_role" NOT NULL DEFAULT 'buyer'::user_role,
    organization_name varchar(100),
    first_name varchar(100) NOT NULL,
    last_name varchar(100),
    is_email_verified bool NOT NULL DEFAULT false,
    is_active bool NOT NULL DEFAULT true,
    is_deleted bool NOT NULL DEFAULT false,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_iterations integer NOT NULL,
    terms_version int4 NOT NULL DEFAULT 1,
    last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
  );`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
