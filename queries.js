const db = require('./database.js');

const productsQuery = 'SELECT id, name, slogan, description, category, default_price FROM products';
const productQuery = 'SELECT id, name, slogan, description, category, default_price FROM products WHERE id=$1';
const featuresQuery = 'SELECT feature, value_name FROM product_features WHERE product_id=$1';
// const stylesQuery = 'SELECT s.id, name, original_price, sale_price, is_default, p.thumbnail_url, p.url, k.id sku, k.size_label, k.quantity FROM styles s LEFT JOIN photos p ON s.id = p.style_id RIGHT JOIN skus k ON s.id = k.style_id WHERE product_id=$1';
// const stylesQuery = ;
// const photosQuery = 'SELECT thumbnail_url, url FROM styles s LEFT JOIN photos ON s.id = style_id WHERE product_id=$1';
// const skusQuery = 'SELECT k.id, k.size_label, k.quantity FROM styles s LEFT JOIN skus k ON s.id = style_id WHERE product_id=$1';

async function getProducts(req, res) {
  const products = await db.any(productsQuery);
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
  const styles = await db.query(`
  SELECT row_to_json(
    (
      SELECT s.id, s.name, s.original_price, s.sale_price, s.is_default AS default,
        (
          SELECT array_agg(row_to_json(c))
          FROM
          (
            SELECT thumbnail_url, url
            FROM photos p
            WHERE p.style_id = 1
          ) c
        ) AS photos,
        (
          SELECT json_agg(skus_all)
          FROM
          (
            SELECT json_build_object(
              (SELECT sku),
              (SELECT obj)
            ) AS skus_all
            FROM
            (
              SELECT id AS sku, json_build_object(
                'size', (
                SELECT size_label
                ),
                'quantity', (
                SELECT quantity
                )
              ) AS obj
              FROM
              (
                SELECT id, size_label, quantity
                FROM skus sk
                WHERE sk.style_id = 1
              ) x
            ) y
          ) z
        ) AS skus
      FROM styles s WHERE s.product_id = $1
    )
  )`, [id]);
  console.log('styles: ', styles);
  res.status(200).send(styles);
}

const getRelated = (req, res) => {
  const id = req.params.product_id;
}

module.exports = {
  getProducts,
  getProduct,
  getStyles,
  getRelated
}
