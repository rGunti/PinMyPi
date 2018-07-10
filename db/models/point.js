'use strict';
module.exports = (sequelize, DataTypes) => {
  var Point = sequelize.define('Point', {
    device_id: { type: DataTypes.INTEGER },
    latitude: { type: DataTypes.DECIMAL(12, 9), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(12, 9), allowNull: false },
    altitude: { type: DataTypes.INTEGER },
    epx: { type: DataTypes.INTEGER, allowNull: false },
    epy: { type: DataTypes.INTEGER, allowNull: false },
    epv: { type: DataTypes.INTEGER, allowNull: false },
    speed: { type: DataTypes.DECIMAL(7, 4) },
    time: { type: DataTypes.DATE },
    additional: { type: DataTypes.STRING(2048), allowNull: false }
  }, {}); Point.associate = function (models) {
    Point.belongsTo(models.Device, {
      foreignKey: 'device_id',
      foreignKeyConstraint: true
    });
  };
  return Point;
};