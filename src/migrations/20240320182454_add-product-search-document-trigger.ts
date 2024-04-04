import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE TRIGGER update_product_tsvector BEFORE INSERT OR UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE products_search_document_trigger();`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('drop trigger if exists update_product_tsvector;');
}
