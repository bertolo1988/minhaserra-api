import { Knex, knex } from 'knex';

let database: Knex | null;
let _config: Knex.Config | null;

async function connectDatabase(inputConfig: Knex.Config): Promise<Knex> {
  try {
    _config = inputConfig;
    const database = knex(inputConfig);
    return database;
  } catch (err) {
    console.error('Failed to connect to the database', err);
    throw err;
  }
}

async function runMigrations(): Promise<void> {
  if (!database) throw new Error('No database connection found');
  try {
    await database.migrate.latest();
  } catch (err) {
    console.error('Migrations failed!', err);
    throw err;
  }
}

export async function getDatabaseInstance(
  inputConfig?: Knex.Config,
): Promise<Knex> {
  if (database) {
    return database;
  }
  if (!inputConfig) throw new Error('Missing database configuration');

  database = await connectDatabase(inputConfig);
  await runMigrations();
  _config = inputConfig;

  return database;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!database) throw new Error('No database connection');
  await database.destroy();
  database = null;
  _config = null;
}

export function isUpdateSuccessfull(
  updateResult: unknown[],
  expectedRowUpdtes = 1,
): boolean {
  return updateResult && updateResult.length === expectedRowUpdtes;
}

export function isDeleteSuccessfull(
  deleteResult: unknown[],
  expectedRowDeletes = 1,
): boolean {
  return deleteResult && deleteResult.length === expectedRowDeletes;
}
