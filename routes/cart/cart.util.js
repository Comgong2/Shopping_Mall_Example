const models = require('../../database/models');

function getProduct (product) {
  return new Promise((resolve, reject) => {
    models.Products.findOne({
      where: {
        product: product
      }
    }).then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
  
}

module.exports = { getProduct };