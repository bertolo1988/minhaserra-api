import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sellers_details', function (table) {
    table
      .uuid('id')
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .primary();
    table.uuid('user_id').unique().notNullable();
    table.uuid('invoice_address_id').nullable();
    table.string('name', 100).notNullable();
    table.string('taxNumber', 20).notNullable();
    table.timestamps(true, true);
    table.foreign('user_id').references('users.id');
    table.foreign('invoice_address_id').references('addresses.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sellers_details');
}
