const db = require('./database.js');

const productsQuery1 = 'SELECT id, name, slogan, description, category, default_price FROM products WHERE id IN (';
const productsQuery2 = ') LIMIT ';
const productQuery = 'SELECT id, name, slogan, description, category, default_price FROM products WHERE id=$1';
const featuresQuery = 'SELECT feature, value_name FROM product_features WHERE product_id=$1';
const stylesQuery = `
SELECT s.id AS style_id, s.name, s.original_price, s.sale_price, s.is_default AS "default?",
  (
    SELECT json_agg(row_to_json(c))
    FROM
    (
      SELECT thumbnail_url, url
      FROM photos p
      WHERE p.style_id = s.id
    ) c
  ) AS photos,
  (
    SELECT json_object_agg(
      (SELECT sku_id),
      (SELECT json_build_object)
    )
    FROM
    (
      SELECT
      (SELECT id) AS sku_id, json_build_object(
        'quantity', (
          SELECT quantity
          ),
        'size', (
          SELECT size_label
          )
      )
      FROM
      (
        SELECT id, size_label, quantity
        FROM skus sk
        WHERE sk.style_id = s.id
      ) y
    ) z
  ) AS skus
FROM styles s WHERE s.product_id = $1`;
const relatedQuery = 'SELECT DISTINCT related_product_id FROM related_products WHERE current_product_id=$1';

async function getProducts(req, res) {
  const getPage = () => {
    if (req.query.page === '0' || !req.query.page) {
      return 1;
    }
    return Number(req.query.page);
  };
  const page = getPage();
  const count = Number(req.query.count) || 5;
  const start = ((page * count) - (count - 1));
  const end = start + count;
  let range = [];

  for (let i = start; i < end; i++) {
    range.push(i);
  };
  range = range.join(', ');
  console.log('start:', start, 'count:', count, 'end:', end);
  const products = await db.any(productsQuery1 + range + productsQuery2 + count);

  res.status(200).send(products);
}

async function getProduct(req, res) {
  const id = req.params.product_id;
  const [product, features] = await db.multi(productQuery + ';' + featuresQuery, [id]);
  const productReturn = product[0];
  productReturn.features = features;
  res.status(200).send(productReturn);
}

async function getStyles(req, res) {
  const id = req.params.product_id;
  const styles = await db.query(stylesQuery, [id]);
  res.status(200).send({'product_id': id, 'results': styles});
}

async function getRelated(req, res) {
  const id = req.params.product_id;
  const related = await db.query(relatedQuery, [id] );
  const relatedList = [];
  related.forEach((relation) => {
    relatedList.push(relation.related_product_id);
  })
  res.status(200).send(relatedList);
}

module.exports = {
  getProducts,
  getProduct,
  getStyles,
  getRelated
}
