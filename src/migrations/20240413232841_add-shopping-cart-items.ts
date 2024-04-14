import type { Knex } from 'knex';

const CARTS_TABLE_NAME = 'shopping_cart_items';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(CARTS_TABLE_NAME, function (table) {
    table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
    table.uuid('user_id').notNullable();
    table.uuid('product_id').notNullable();
    table.integer('quantity').notNullable().defaultTo(1);
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('product_id').references('products.id').onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['user_id', 'product_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(CARTS_TABLE_NAME);
}
