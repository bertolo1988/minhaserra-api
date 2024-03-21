import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE media_type AS ENUM ('image','video');`);
  await knex.schema.createTable('products_media', function (table) {
    table
      .uuid('id')
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .primary();
    table.uuid('product_id').notNullable();
    table.specificType('type', 'media_type').notNullable();
    table.text('url').notNullable();
    table.foreign('product_id').references('products.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products_media');
  await knex.raw(`DROP TYPE IF EXISTS media_type;`);
}
