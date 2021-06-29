import { check } from 'k6';
import http from 'k6/http';
const id = () => {
  return Math.floor(Math.random() * 1000000);
};

const productsTest = `http://localhost:3000/products`;
const productTest = `http://localhost:3000/products?product_id&${id()}`;
const styleTest = `http://localhost:3000/products?product_id&${id()}/styles`;
const relatedTest = `http://localhost:3000/products?product_id&${id()}/related`;

export default function() {
  let res = http.get(relatedTest);
  check(res, {
    'is status 200': (r) => r.status === 200
  });
};