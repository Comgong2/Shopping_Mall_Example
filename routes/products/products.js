const express = require('express'),
  router = express.Router(),
  util = require('./products.util');

router.get('/', (req, res) => {
  util.getProducts()
    .then(products => {
      if (!req.session.userid) return res.render('products', {valid: false, products: products});
      res.render('products', {valid:true, products: products})
    })
    .catch(err => {
      return err;
    });
});

router.get('/detail/:product', (req, res) => {
  let product = req.params.product;
  util.getSingleProduct(product)
    .then(product => {
      if (!req.session.userid) return res.render('product_detail', {valid: false, product: product});
      res.render('product_detail', {product: product, valid: true});
    })
    .catch(err => {
      console.error(err);
    })
  
})

module.exports = router;