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

// Buyers
export const verifiedBuyer1: UserModel = SeedUtils.getVerifiedUser(
  '507b656f-ba2a-4bc3-aff8-7adb6f9c9e4a',
  UserRole.BUYER,
);

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

// Seller 1 products

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

// Seller 2 products

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

// Seller 3 products

const verifiedSeller3Product1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '14c83ec2-ecc0-4a74-8002-1bd4112daff2',
    userId: verifiedSeller3.id,
    category: ProductCategory.FOOD,
    subCategory: ProductSubCategory.FOOD_WINE,
    name: 'Dona Maria Tinto 2016',
    nameEnglish: 'Dona Maria Red 2016',
    description:
      'Vinho de bagas vermelhas complexas, torradas, com sugestões de ameixas maduras. Sabor rico a baga vermelha com grande persistência, equilibrado, arredondado e com uma boa estrutura que permitirá envelhecer bem.',
    descriptionEnglish:
      'Wine of complex red berries, toasted, with suggestions of ripe plums. Rich flavor of red berry with great persistence, balanced, rounded and with a good structure that will allow it to age well.',
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

const verifiedSeller3Product4: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: 'b276fe13-d827-4e9f-9490-6ab9b4d2bcbe',
    userId: verifiedSeller3.id,
    category: ProductCategory.HOME,
    subCategory: ProductSubCategory.HOME_FURNITURE,
    name: 'Berço de madeira de pinho',
    nameEnglish: 'Pine wood crib',
    description:
      'Berço de madeira de pinho, feito à mão por artesãos locais. Pintado à mão com tintas ecológicas.',
    descriptionEnglish:
      'Pine wood crib, handmade by local craftsmen. Hand painted with ecological paints.',
    price: 7500,
  });

const verifiedSeller3Product5: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '954317c7-9c7b-430a-aee2-9a0a72a0c6a0',
    userId: verifiedSeller3.id,
    category: ProductCategory.CLOTHING,
    subCategory: ProductSubCategory.CLOTHING_ACCESSORIES,
    name: 'Cache-col de lã de ovelha',
    nameEnglish: 'Sheep wool neck warmer',
    description:
      'Cache-col feito à mão com lã de ovelha portuguesa. Disponível em várias cores.',
    descriptionEnglish:
      'Handmade neck warmer with Portuguese sheep wool. Available in several colors.',
    price: 2500,
  });

const verifiedSeller3Product6: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: 'fa368ea0-0216-474c-a7d1-64443d10f1dc',
    userId: verifiedSeller3.id,
    category: ProductCategory.TOYS,
    subCategory: ProductSubCategory.TOYS_OTHER,
    name: 'Bicleta antiga restaurada',
    nameEnglish: 'Restored old bicycle',
    description:
      'Bicicleta antiga restaurada, com pintura original e peças originais. Perfeita para colecionadores.',
    descriptionEnglish:
      'Restored old bicycle, with original paint and original parts. Perfect for collectors.',
    price: 2500,
  });

const verifiedSeller3Product7: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '392d796d-09b2-4348-b902-8877f01dc714',
    userId: verifiedSeller3.id,
    category: ProductCategory.CLOTHING,
    subCategory: ProductSubCategory.CLOTHING_ACCESSORIES,
    name: 'Anel de ouro com diamante',
    nameEnglish: 'Gold ring with diamond',
    description:
      'Anel de ouro com diamante de 0.5 quilates. Disponível em vários tamanhos.',
    descriptionEnglish:
      'Gold ring with 0.5 carat diamond. Available in several sizes.',
    price: 2500,
  });

// Product images

const verifiedSeller1Product1Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '297aade8-69c4-4bcf-80e9-b143aeec128f',
    verifiedSeller1Product1.id,
    'https://www.quintasdeseia.pt/wp-content/uploads/2021/03/MIG00020.jpg',
  );

const verifiedSeller1Product2Image1: ProductImageModel =
  SeedUtils.getProductImage(
    'ddee098a-f934-417c-b504-2b00e7a16ab5',
    verifiedSeller1Product2.id,
    'https://cdn.shopk.it/usercontent/apisfilanis/media/images/aad7564-_mg_8566-1.jpg',
  );

const verifiedSeller1Product3Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '7f48b1fb-f09d-4e49-ae82-c5fac4adc2b8',
    verifiedSeller1Product3.id,
    'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwd435d4bc/images/col/205/2050281-frente.jpg?sw=2000&sh=2000',
  );

const verifiedSeller1Product3Image2: ProductImageModel =
  SeedUtils.getProductImage(
    '7dd7ff8c-ba8b-4ed4-81fd-03039c861d3d',
    verifiedSeller1Product3.id,
    'https://www.vinha.pt/wp-content/uploads/2015/05/100476.jpg',
  );

const verifiedSeller1Product3Image3: ProductImageModel =
  SeedUtils.getProductImage(
    '46a4708e-63a0-418d-be36-c6cda4953c2e',
    verifiedSeller1Product3.id,
    'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwd586e784/images/col/364/3640159-frente.jpg?sw=2000&sh=2000',
  );

const verifiedSeller1Product4Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '9ef3daaa-f83f-4165-a3aa-e9b52f01ac21',
    verifiedSeller1Product4.id,
    'https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw2467df6d/images/col/205/2050003-frente.jpg?sw=2000&sh=2000',
  );

const verifiedSeller2Product1Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '0bbf035d-f8cd-4438-95d8-eba001f939f6',
    verifiedSeller2Product1.id,
    'https://mygleba.com/images/products/hs08mk-cesta%20grande.png',
  );

const verifiedSeller2Product2Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '28c55621-f17d-4049-bec7-9624d90c760b',
    verifiedSeller2Product2.id,
    'https://7maravilhas.pt/wp-content/uploads/2020/05/462_275_patrimonio-1.jpg',
  );

const verifiedSeller2Product3Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '4a7c5a20-a6b8-46fd-b80e-dc19045b3fe3',
    verifiedSeller2Product3.id,
    'https://1362643621.rsc.cdn77.org/temp/1674007805_7e93acdab394ce5ce737ade08fc4676b.jpg',
  );

const verifiedSeller2Product4Image1: ProductImageModel =
  SeedUtils.getProductImage(
    'c6a2693a-96c4-41a1-8a1a-11f9b37cc4b9',
    verifiedSeller2Product4.id,
    'https://www.adegamayor.pt/resources/medias/shop/products/thumbnails/Shop_image_product_detail_11/9c44b80f6d40a1fb2270a8eca715fb1e-3.jpg',
  );

const verifiedSeller3Product1Image1: ProductImageModel =
  SeedUtils.getProductImage(
    'b2ed65c8-8d98-4f79-b71b-81e6f6c0fa29',
    verifiedSeller3Product1.id,
    'https://www.garrafeirasoares.pt/temp/JPG_98c9af32f02b349130c79d15eb4e550c.png',
  );

const verifiedSeller3Product2Image1: ProductImageModel =
  SeedUtils.getProductImage(
    'c404eefc-f925-49c3-a81c-9e6f9bae4b49',
    verifiedSeller3Product2.id,
    'https://wineexpert.pt/1218-home_default/82-310-010-00141-quinta-do-mouro-vinha-do-malho-tinto-2017-1-5l.jpg',
  );

const verifiedSeller3Product3Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '0adc678b-e047-41e8-8917-e101bdae17c2',
    verifiedSeller3Product3.id,
    'https://wineexpert.pt/1121-large_default/82-310-010-00124-julian-reynolds-reserva-tinto-2017-0-75l.jpg',
  );

const verifiedSeller3Product4Image1: ProductImageModel =
  SeedUtils.getProductImage(
    'b4f09af4-a7fd-432b-b498-41c2e56defd1',
    verifiedSeller3Product4.id,
    'https://www.nautilus.pt/wp-content/uploads/2020/07/Be-01.jpg',
  );

const verifiedSeller3Product5Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '83cd82db-2087-4a2a-9ae0-28b916dee2f6',
    verifiedSeller3Product5.id,
    'https://www.quintasdeseia.pt/wp-content/uploads/2020/12/IMG_20201208_113639-559x800-1.jpg',
  );

const verifiedSeller3Product6Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '10f44249-d5f5-4546-b866-0fb3ae6b325b',
    verifiedSeller3Product6.id,
    'https://img.freepik.com/fotos-premium/bicicleta-antiga-primeira-bicicleta_568470-220.jpg',
  );

const verifiedSeller3Product7Image1: ProductImageModel =
  SeedUtils.getProductImage(
    '400a61db-805e-4c22-891f-d41600522053',
    verifiedSeller3Product7.id,
    'https://www.orovivo.com/210973-superlarge_default/sortija-de-oro-18k-rodio-con-aro-de-circonitas-cruzado.jpg',
  );

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('products').del();
  await knex('product_images').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedBuyer1),
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
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product4),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product5),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product6),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product7),
  ]);
  await knex('product_images').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product1Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product2Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product3Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product3Image2),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product3Image3),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product4Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product1Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product2Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product3Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product4Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product1Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product2Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product3Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product4Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product5Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product6Image1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller3Product7Image1),
  ]);
}
