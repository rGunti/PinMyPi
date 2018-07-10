'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Points', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      device_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Devices', key: 'id' }
      },
      latitude: {
        type: Sequelize.DECIMAL(12, 9),
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL(12, 9),
        allowNull: false
      },
      altitude: {
        type: Sequelize.INTEGER
      },
      epx: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      epy: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      epv: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      speed: {
        type: Sequelize.DECIMAL(7, 4)
      },
      time: {
        type: Sequelize.DATE
      },
      additional: {
        type: Sequelize.STRING(2048),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('points');
  }
};