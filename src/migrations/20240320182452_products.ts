import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', function (table) {
    table
      .uuid('id')
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .primary();
    table.uuid('user_id').notNullable();
    table.specificType('category', 'product_category').notNullable();
    table.specificType('sub_category', 'product_sub_category').notNullable();
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    table.string('country_code', 2).notNullable();
    table.string('region', 100).nullable();
    table.integer('avaliable_quantity').notNullable().defaultTo(0);
    table.bigInteger('price').notNullable();
    table.boolean('is_on_sale').notNullable().defaultTo(true);
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.boolean('is_approved').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
}
