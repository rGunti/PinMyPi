'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    passhash: { type: DataTypes.STRING, allowNull: false },
    disabled: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};