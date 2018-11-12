'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 7,
        max: 30
      }
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        confirm: function (val) {
          if (!/^\d{3}-\d{3,4}-\d{4}$/.test(val)) {
            throw new Error("Wrong Phone Number Type")
          }
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'User'
  });
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};