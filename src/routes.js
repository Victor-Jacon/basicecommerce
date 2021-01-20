const express = require('express');
const ProductController = require('./app/controllers/ProductController');
const routes = express.Router();
const multer = require ('./app/middlewares/multer')

const productController = require('./app/controllers/ProductController');

routes.get('/', function (req, res) {
  return res.send('layout.njk');
});

routes.get('/products/create', productController.create);
routes.get('/products/:id', productController.edit);

routes.post('/products', multer.array("photos", 6), ProductController.post);
routes.put('/products', multer.array("photos", 6), ProductController.put);
routes.delete('/products', ProductController.delete);

routes.get('/ads/create', function (req, res) {
  return res.redirect('/products/create');
});

module.exports = routes;
