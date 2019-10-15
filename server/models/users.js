'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {});

  Users.beforeCreate(users => {
    users.password = bcrypt.hashSync(
      users.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  Users.associate = function(models) {
    // associations can be defined here
  };

  Users.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  return Users;
};