import { pgpass, pguser } from 'config.js';

const { Pool } = require('pg');
const pool = new Pool({
  user: pguser,
  host: 'localhost',
  database: 'public',
  password: pgpass,
  port: 5432,
});

const getProducts = (req, res) => {
  pool.query('SELECT id, name, slogan, description, category, default_price FROM products', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
}

const getProduct = (req, res) => {
  const id = req.params.product_id;
  pool.query('SELECT id, name, slogan, description, category, default_price FROM products WHERE id=$1', [id] , (error, results) => {
    if (error) {
      throw error;
    }
    json(results.rows);
  })
}

const getStyles = (req, res) => {
  const id = req.params.product_id;
  pool.query('SELECT * FROM styles WHERE product_id=$1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200)
  })
}

const getRelated = (req, res) => {
  const id = req.params.product_id;
  pool.query('SELECT related_product_id FROM related_products WHERE current_product_id=$1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows)
  })
}

module.exports = {
  getProducts,
}
