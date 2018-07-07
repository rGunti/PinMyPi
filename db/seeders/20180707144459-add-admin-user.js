'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
        username: 'admin',
        passhash: '710a90d68dfb72d39ce453881738804769c3dbc2e0914106a7e2b1d589081d83',
        disabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        username: 'disabled',
        passhash: '710a90d68dfb72d39ce453881738804769c3dbc2e0914106a7e2b1d589081d83',
        disabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
