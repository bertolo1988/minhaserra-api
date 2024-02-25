import { Knex, knex } from 'knex';

let database: Knex | null;
let config: Knex.Config | null;

async function connectDatabase(inputConfig: Knex.Config): Promise<Knex> {
  try {
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

export async function runSeedByName(seedName: string): Promise<void> {
  if (!database) throw new Error('No database connection found');
  try {
    await database.seed.run({ specific: seedName });
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
  config = inputConfig;

  return database;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!database) throw new Error('No database connection');
  await database.destroy();
  database = null;
  config = null;
}

export function isUpdateSuccessfull(
  updateResult: any[],
  expectedRowUpdtes = 1,
): boolean {
  return updateResult.length === expectedRowUpdtes;
}
