import dotenv from 'dotenv';
import { Knex } from 'knex';
dotenv.config();

import { ProductImageModel } from '../../src/controllers/products/product-images.types';
import {
  ProductCategory,
  ProductModel,
  ProductSubCategory,
} from '../../src/controllers/products/products.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { SeedUtils } from '../seed-utils';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

// Sellers

export const verifiedSeller1: UserModel = SeedUtils.getVerifiedUser(
  '760f0154-cbd1-447c-a875-9b58cda6bc72',
  UserRole.SELLER,
);
export const verifiedSeller2: UserModel = SeedUtils.getVerifiedUser(
  '2e3cdbcb-5231-441c-9a6b-760eb504f500',
  UserRole.SELLER,
);
export const verifiedSeller3: UserModel = SeedUtils.getVerifiedUser(
  'a9ef0273-3a5d-40a0-ae63-0c075a18c10c',
  UserRole.SELLER,
);

// Products

const verifiedSeller1Product1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '52366966-5206-4347-8bde-3c9964121436',
    userId: verifiedSeller1.id,
    name: 'Mel da Serra da Estrela',
    nameEnglish: 'Honey from Serra da Estrela',
    description:
      'Mel biológico proveniente da Serra da Estrela, feito à mão por apicultores locais.',
    descriptionEnglish:
      'Organic honey from Serra da Estrela, handmade by local beekeepers.',
    price: 1500,
  });

const verifiedSeller1Product2: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '99f7840e-1995-48da-852a-35e39135898b',
    userId: verifiedSeller1.id,
    name: 'Mel biológico de Aveiro',
    nameEnglish: 'Honey from Aveiro',
    description:
      'Mel biológico proveniente da região de Aveiro, feito à mão por apicultores locais. Mel de cacto, eucalipto e laranjeira.',
    descriptionEnglish:
      'Organic honey from Aveiro, handmade by local beekeepers. Cactus, eucalyptus and orange blossom honey.',
    price: 2500,
  });

const verifiedSeller1Product3: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '49df6a06-e66b-4adc-8905-352b44b06964',
    userId: verifiedSeller1.id,
    category: ProductCategory.FOOD,
    subCategory: ProductSubCategory.FOOD_WINE,
    name: 'Cálem Velhotes Vinho do Porto Tawny',
    nameEnglish: 'Cálem Velhotes Port Wine Tawny',
    description:
      'Vinho com 20% de alcool proveninente do Douro. Envelhecido em barris de carvalho.',
    descriptionEnglish:
      'Wine with 20% alcohol from Douro. Aged in oak barrels.',
    price: 400,
  });

const verifiedSeller1Product4: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '526b038d-e0e1-4e9c-aae9-dad75457d572',
    userId: verifiedSeller1.id,
    category: ProductCategory.FOOD,
    subCategory: ProductSubCategory.FOOD_WINE,
    name: 'Ferreira Dona Antónia Vinho do Porto Tawny Reserva',
    nameEnglish: 'Ferreira Dona Antónia Port Wine Tawny Reserve',
    description:
      'Um Vinho do Porto clássico, de Excelência e com o sabor genuíno da melhor produção de vinhos da Região do Douro.',
    descriptionEnglish:
      'A classic Port Wine, of Excellence and with the genuine flavor of the best wine production in the Douro Region.',
    price: 990,
  });

const verifiedSeller2Product1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '1a751baf-bddb-4835-b0d9-a6c15c389a9c',
    userId: verifiedSeller2.id,
    category: ProductCategory.CLOTHING,
    subCategory: ProductSubCategory.CLOTHING_ACCESSORIES,
    name: 'Cesta de junco do juncal',
    nameEnglish: 'Juncal wicker basket',
    description:
      'As cestas de junco tradicionais portuguesas fazem parte do nosso património cultural. São feitas em teares e todo o processo é manual, desde a apanha, secagem e tingimento do junco até a tecelagem e costura da cesta. Existem em todas as cores, desenhos e tamanhos imagináveis...',
    descriptionEnglish:
      'Traditional Portuguese wicker baskets are part of our cultural heritage. They are made on looms and the entire process is manual, from the picking, drying and dyeing of the wicker to the weaving and sewing of the basket. They come in all colors, designs and sizes imaginable...',
    price: 1500,
  });

const verifiedSeller2Product2: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '6640649d-0ef3-4489-8d6a-ba8c7de00517',
    userId: verifiedSeller2.id,
    category: ProductCategory.CLOTHING,
    subCategory: ProductSubCategory.CLOTHING_TSHIRTS,
    name: 'Camisola feita como uma manta de Algodão da Mira',
    nameEnglish: 'Sweater made like a Mira Cotton blanket',
    description: `Mira: a nossa terra, a nossa origem, a nossa inspiração. Esta manta é uma homenagem à história e tradições de Mira d’Aire. Este padrão elegante transmite tranquilidade, e em conjunto com o suave toque natural do algodão é o complemento perfeito para qualquer cama ou sofá. 100% Algodão`,
    descriptionEnglish:
      'Mira: our land, our origin, our inspiration. This blanket is a tribute to the history and traditions of Mira d’Aire. This elegant pattern conveys tranquility, and together with the soft natural touch of cotton is the perfect complement to any bed or sofa. 100% Cotton',
    price: 2300,
  });

const verifiedSeller2Product3: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '07a80ffb-18aa-4235-9e26-b8cceb9999a7',
    userId: verifiedSeller2.id,
    category: ProductCategory.HOME,
    subCategory: ProductSubCategory.HOME_RUGS,
    name: 'Tapete de trapos da Mira de Aire',
    nameEnglish: 'Mira de Aire rag rug',
    description: `Tapete feito de restos de tecido à moda da Mira de Aire. 100% Algodão`,
    descriptionEnglish:
      'Rug made from fabric scraps in the style of Mira de Aire. 100% Cotton',
    price: 3450,
  });

const verifiedSeller2Product4: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '8bdb2d0f-4456-4f60-af44-13b08c54561c',
    userId: verifiedSeller2.id,
    category: ProductCategory.FOOD,
    subCategory: ProductSubCategory.FOOD_WINE,
    name: 'Adega Mayor Reserva Tinto 2021',
    nameEnglish: 'Adega Mayor Red Reserve 2021',
    description:
      'Vinho de cor ruby, concentrado. No nariz é intenso e expressivo, sugere bagas vermelhas, ameixa preta madura e ligeiro floral de violeta, assentes em notas de especiaria, lápis e tostado da madeira de estágio. A boca estruturada, confirma e aprofunda o perfil aromático, exprime taninos assertivos e integrados e culmina num final longo e persistente.',
    descriptionEnglish:
      'Ruby-colored wine, concentrated. On the nose it is intense and expressive, suggesting red berries, ripe black plum and a slight floral violet, based on notes of spice, pencil and toasted wood. The structured mouth confirms and deepens the aromatic profile, expresses assertive and integrated tannins and culminates in a long and persistent finish.',
    price: 1111,
  });

const verifiedSeller3Product1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '14c83ec2-ecc0-4a74-8002-1bd4112daff2',
    userId: verifiedSeller3.id,
    category: ProductCategory.FOOD,
    subCategory: ProductSubCategory.FOOD_WINE,
    name: 'Dona Maria Tinto 2016',
    nameEnglish: 'Dona Maria Red 2016',
    description:
      'Bagas vermelhas complexas, torradas, com sugestões de ameixas maduras. Sabor rico a baga vermelha com grande persistência, equilibrado, arredondado e com uma boa estrutura que permitirá envelhecer bem.',
    descriptionEnglish:
      'Complex red berries, toasted, with suggestions of ripe plums. Rich red berry flavor with great persistence, balanced, rounded and with a good structure that will allow it to age well.',
    price: 750,
  });

const verifiedSeller3Product2: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: 'bad3733f-e337-4972-a865-232ca9603193',
    userId: verifiedSeller3.id,
    category: ProductCategory.FOOD,
    subCategory: ProductSubCategory.FOOD_WINE,
    name: 'Vinho da quinta Do Mouro Vinha Do Malhó 2017 Magnum',
    nameEnglish: 'Wine from Quinta Do Mouro Vinha Do Malhó 2017 Magnum',
    description:
      'Nariz muito atraente, com as notas delicadas da madeira muito bem integradas na fruta azul e preta, suaves notas herbáceas, grafite, absolutamente sedutor.Leve e fresco, luminoso, todo feito de delicadeza e fascínio.',
    descriptionEnglish:
      'Very attractive nose, with the delicate notes of the wood very well integrated in the blue and black fruit, soft herbaceous notes, graphite, absolutely seductive. Light and fresh, luminous, all made of delicacy and fascination.',
    price: 9000,
  });

const verifiedSeller3Product3: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '2b47c318-5488-4c93-b33f-f83016d3bcd9',
    userId: verifiedSeller3.id,
    category: ProductCategory.FOOD,
    subCategory: ProductSubCategory.FOOD_WINE,
    name: 'Reynolds Wine Growers Julian Reynolds Reserva Tinto 2017',
    nameEnglish: 'Reynolds Wine Growers Julian Reynolds Red Reserve 2017',
    description:
      'De cor grená. Aroma a frutos vermelhos maduros, notas de violetas e cacau. Sabor elegante e fresco, com taninos redondos, maduros e encorpados, com um final longo e persistente.',
    descriptionEnglish:
      'Garnet color. Aroma of ripe red fruits, notes of violets and cocoa. Elegant and fresh flavor, with round, ripe and full-bodied tannins, with a long and persistent finish.',
    price: 8500,
  });

// Product images

const verifiedSeller1Product3Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '7f48b1fb-f09d-4e49-ae82-c5fac4adc2b8',
    verifiedSeller1Product3.id,
  );

const verifiedSeller1Product3Image2: ProductImageModel =
  SeedUtils.getProductImage(
    '7dd7ff8c-ba8b-4ed4-81fd-03039c861d3d',
    verifiedSeller1Product3.id,
  );

const verifiedSeller1Product3Image3: ProductImageModel =
  SeedUtils.getProductImage(
    '46a4708e-63a0-418d-be36-c6cda4953c2e',
    verifiedSeller1Product3.id,
  );

const verifiedSeller1Product4Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '9ef3daaa-f83f-4165-a3aa-e9b52f01ac21',
    verifiedSeller1Product4.id,
  );

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('products').del();
  await knex('product_images').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3),
  ]);
  await knex('products').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product2),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product3),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product4),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product2),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product3),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product4),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product2),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product3),
  ]);
  await knex('product_images').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product3Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product3Image2),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product3Image3),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product4Image1),
  ]);
}
