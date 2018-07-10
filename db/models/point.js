'use strict';
module.exports = (sequelize, DataTypes) => {
  var Point = sequelize.define('Point', {
    device_id: { types: DataTypes.INTEGER },
    latitude: { types: DataTypes.DECIMAL(12, 9), allowNull: false },
    longitude: { types: DataTypes.DECIMAL(12, 9), allowNull: false },
    altitude: { types: DataTypes.INTEGER },
    epx: { types: DataTypes.INTEGER, allowNull: false },
    epy: { types: DataTypes.INTEGER, allowNull: false },
    epv: { types: DataTypes.INTEGER, allowNull: false },
    speed: { types: DataTypes.DECIMAL(7, 4) },
    time: { types: DataTypes.DATE },
    additional: { types: DataTypes.STRING(2048), allowNull: false }
  }, {}); Point.associate = function (models) {
    Point.belongsTo(models.Device, {
      foreignKey: 'device_id',
      foreignKeyConstraint: true
    });
  };
  return Point;
};