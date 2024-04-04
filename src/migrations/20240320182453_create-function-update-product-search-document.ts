import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE FUNCTION products_search_document_trigger() RETURNS trigger AS $$
    BEGIN
      new.search_document := setweight(to_tsvector('english',coalesce(new.name_english,'')),'A') || setweight(to_tsvector('english',coalesce(new.description_english,'')),'B');
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('drop function if exists products_search_document_trigger;');
}
