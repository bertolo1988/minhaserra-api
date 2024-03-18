import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', function (table) {
    table.string('invoice_name', 100).nullable();
    table.string('invoice_tax_number', 20).nullable();
    table.uuid('invoice_address_id').nullable();
    table.uuid('shipping_address_id').nullable();
    table.foreign('invoice_address_id').references('addresses.id');
    table.foreign('shipping_address_id').references('addresses.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', function (table) {
    table.dropColumn('invoice_name');
    table.dropColumn('invoice_tax_number');
    table.dropColumn('invoice_address_id');
    table.dropColumn('shipping_address_id');
  });
}
