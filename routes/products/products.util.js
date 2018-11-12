const models = require('../../database/models');

function getProducts () {
  return new Promise((resolve, reject) => {
    models.Products.findAll()
    .then(products => {
      resolve(products)
    })
    .catch(err => {
      reject(err);
    })
  })
  
}

function getSingleProduct (product) {
  return new Promise((resolve, reject) => {
    models.Products.findOne({
      where: {
        product: product
      }
    }).then(product => {
      resolve(product)
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = { getProducts, getSingleProduct };