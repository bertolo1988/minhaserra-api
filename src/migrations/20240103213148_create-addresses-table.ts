import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('addresses', function (table) {
    table
      .uuid('id')
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .primary();
    table.uuid('user_id').notNullable();
    table.string('label', 100).notNullable();
    table.string('country_code', 2).notNullable();
    table.string('name', 100).notNullable();
    table.string('line_1', 255).notNullable();
    table.string('line_2', 255).nullable();
    table.string('city', 100).notNullable();
    table.string('region', 100).notNullable();
    table.string('postal_code', 50).notNullable();
    table.string('phone_number', 50).nullable();
    table.timestamps(true, true);
    table.foreign('user_id').references('users.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('addresses');
}
