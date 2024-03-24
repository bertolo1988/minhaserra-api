import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    email varchar(100) UNIQUE COLLATE "case_insensitive" NOT NULL,
    "role" public."user_role" DEFAULT 'buyer'::user_role NOT NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NULL,
    is_email_verified bool DEFAULT false NOT NULL,
    is_active bool DEFAULT true NOT NULL,
    is_deleted bool DEFAULT false NOT NULL,
    password_hash text NOT NULL,
    password_salt text NOT NULL,
    password_iterations int4 NOT NULL,
    terms_version int4 DEFAULT 1 NOT NULL,
    last_login_at timestamptz NULL,
    invoice_name varchar(100) NULL,
    invoice_tax_number varchar(20) NULL,
    invoice_address_id uuid NULL,
    shipping_address_id uuid NULL,
    birth_date DATE NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
  );`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
