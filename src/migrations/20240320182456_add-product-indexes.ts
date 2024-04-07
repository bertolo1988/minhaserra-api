import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE INDEX IF NOT EXISTS search_document_idx on products using gin(search_document);`,
  );
  await knex.raw(
    `CREATE INDEX IF NOT EXISTS name_idx on products using btree(name);`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('drop index if exists search_document_idx;');
  await knex.raw(`drop index if exists name_idx;`);
}
