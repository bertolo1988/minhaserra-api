import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // TODO continue here
  await knex.raw(
    `CREATE TYPE product_category AS ENUM ('admin', 'moderator', 'buyer', 'seller');`,
  );
  await knex.raw(
    `CREATE TYPE product_sub_category AS ENUM ('admin', 'moderator', 'buyer', 'seller');`,
  );
  await knex.schema.createTable('products', function (table) {
    table
      .uuid('id')
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .primary();
    table.uuid('user_id').notNullable();
    table.uuid('category').notNullable();
    table.uuid('sub_category').nullable();
    table.string('name', 100).notNullable();
    table.text('description').notNullable();
    table.string('country_code', 2).notNullable();
    table.string('region', 100).nullable();
    table.integer('avaliable_quantity').notNullable();
    table.bigInteger('price').notNullable();
    table.text('image_one_url').notNullable();
    table.text('image_two_url').nullable();
    table.text('image_three_url').nullable();
    table.text('image_four_url').nullable();
    table.text('image_five_url').nullable();
    table.text('video_one_url').nullable();
    table.text('video_two_url').nullable();
    table.boolean('is_on_sale').notNullable().defaultTo(true);
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.boolean('is_approved').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
  await knex.raw(`DROP TYPE IF EXISTS product_sub_category;`);
  await knex.raw(`DROP TYPE IF EXISTS product_category;`);
}
