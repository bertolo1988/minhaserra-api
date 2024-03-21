import type { Knex } from 'knex';

const PRODUCT_CATEGORY_VALUES = ['other', 'food', 'clothing', 'home', 'toys'];
const PRODUCT_SUB_CATEGORY_VALUES = [
  'food_other',
  'food_olive-oil',
  'food_drinks',
  'food_vegetables',
  'food_honey',
  'food_cheese',
  'food_wine',
  'food_charcuterie',
  'food_sweets',
  'clothing_other',
  'clothing_footwear',
  'clothing_costumes',
  'clothing_accessories',
  'clothing_pants',
  'clothing_sweaters',
  'clothing_tshirts',
  'clothing_baby',
  'home_other',
  'home_furniture',
  'home_rugs',
  'home_wall-art',
  'home_garden',
  'home_kitchen',
  'home_bathroom',
  'toys_other',
  'toys_puzzles',
  'toys_cards',
  'toys_board-games',
  'toys_baby',
];

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE TYPE product_category AS ENUM ('${PRODUCT_CATEGORY_VALUES.join("','")}');`,
  );
  await knex.raw(
    `CREATE TYPE product_sub_category AS ENUM ('${PRODUCT_SUB_CATEGORY_VALUES.join("','")}');`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TYPE IF EXISTS product_sub_category;`);
  await knex.raw(`DROP TYPE IF EXISTS product_category;`);
}
