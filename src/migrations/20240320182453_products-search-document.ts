import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE FUNCTION products_search_document_trigger() RETURNS trigger AS $$ begin new.search_document := setweight(to_tsvector('english',coalesce(new.name_english,'')),'A')`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
}
