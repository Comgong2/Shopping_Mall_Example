const models = require("../database/models/index.js");

module.exports = () => { 
  return models.sequelize.sync()
};