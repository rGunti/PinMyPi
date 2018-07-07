'use strict';
module.exports = (sequelize, DataTypes) => {
  var Device = sequelize.define('Device', {
    owner_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    key: { type: DataTypes.STRING, allowNull: false }
  }, {});
  Device.associate = function (models) {
    Device.belongsTo(models.User, {
      foreignKey: 'owner_id',
      foreignKeyConstraint: true
    });
  };
  return Device;
};