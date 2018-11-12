'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('Products', {
    product: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    underscored: true,
    tableName: 'Products',
    timestamps: false
  });
  products.associate = function(models) {
    // associations can be defined here
  };
  return products;
};