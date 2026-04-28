'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_name: 'admin',
        description: 'System administrator with full access to manage books, users, and library operations.'
      },
      {
        role_name: 'librarian',
        description: 'Librarian responsible for managing books, borrow records, and student fines.'
      },
      {
        role_name: 'student',
        description: 'Student user who can search for books, borrow, and view their borrow history.'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};