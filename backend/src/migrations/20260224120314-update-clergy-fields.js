'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('ClergyMembers', 'period', 'startYear');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('ClergyMembers', 'startYear', 'period');
  }
};
