import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('email', 100).notNullable().unique();
    table.specificType('role', 'user_role').notNullable().defaultTo('buyer');
    table.string('organization_name', 100).nullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.string('password_hash', 255).notNullable();
    table.integer('terms_version').unsigned().notNullable().defaultTo(1);
    table.timestamp('last_login_at').nullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
