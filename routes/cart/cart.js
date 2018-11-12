const express = require('express'),
  router = express.Router(),
  util = require('./cart.util');

router.get('/', (req, res) => {
  if (!req.session.userid) return res.render('error', {error_message: '로그인을 먼저 해주세요.', redirect_page: '/auth'});
  res.render('cart', {products: req.session.cart});
});

router.post('/addItem', (req, res) => {
  if (!req.session.userid) return res.send(false)
  let body = req.body;
  util.getProduct(body.product)
    .then(product => {
      let item = {
        product: product.product,
        price: product.price,
        qty: body.qty
      };
      req.session.cart.push(item);
      res.send(true);
    })
    .catch(err => {
      console.error(err);
    }) 
  
});

router.post('/remove', (req, res) => {
  let index = req.body.index;

  req.session.cart.splice(index, 1);
    
  res.send(index);
})

module.exports = router;