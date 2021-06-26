const express = require('express');
const { getProducts, getProduct, getStyles, getRelated } = require('./queries');
const app = express();
const port = 3000;

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.get('/products', getProducts);
app.get('/products/:product_id', getProduct);
app.get('/products/:product_id/styles', getStyles);
app.get('/products/:product_id/related', getRelated);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
