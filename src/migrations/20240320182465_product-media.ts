import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product_images', function (table) {
    table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
    table.uuid('product_id').notNullable();
    table.text('url').unique().notNullable();
    table.text('name').notNullable();
    table.text('description').nullable();
    table.foreign('product_id').references('products.id').onDelete('CASCADE');
    table.timestamps(true, true);
    table.index('product_id', 'product_images_product_id_index');
  });
  await knex.schema.createTable('product_videos', function (table) {
    table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
    table.uuid('product_id').notNullable();
    table.text('url').notNullable();
    table.text('description').nullable();
    table.foreign('product_id').references('products.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('product_videos');
  await knex.schema.dropTable('product_images');
}
