const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/products', db.getProducts);
app.get('/products:product_id', db.getProduct);
app.get('/products:product_id/styles', db.getStyles);
app.get('/products:product_id/related', db.getRelated);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
