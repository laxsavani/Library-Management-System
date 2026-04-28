'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Fiction',
        description: 'Books that contain stories made up by the author, such as novels and short stories.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Science',
        description: 'Books related to scientific research, discoveries, and academic studies.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'History',
        description: 'Books documenting past events, civilizations, and historical figures.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
