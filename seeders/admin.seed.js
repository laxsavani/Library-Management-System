'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Check if user already exists
    const [existingUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'laxsavani4259@gmail.com';`
    );

    if (existingUsers.length === 0) {
      // Insert User
      await queryInterface.bulkInsert('users', [
        {
          name: 'Admin',
          email: 'laxsavani4259@gmail.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    }

    // Get the user ID (re-query to be sure we have it)
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'laxsavani4259@gmail.com';`
    );
    const userId = users[0].id;

    // Get the role ID
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'admin';`
    );
    
    if (roles.length > 0) {
      const roleId = roles[0].id;

      // Check if role mapping already exists
      const [existingRoleData] = await queryInterface.sequelize.query(
        `SELECT id FROM role_data WHERE user_id = ${userId} AND role_id = ${roleId};`
      );

      if (existingRoleData.length === 0) {
        // Link user to role
        await queryInterface.bulkInsert('role_data', [
          {
            user_id: userId,
            role_id: roleId,
            assigned_at: new Date()
          }
        ], {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'laxsavani4259@gmail.com';`
    );
    if (users.length > 0) {
      const userId = users[0].id;
      await queryInterface.bulkDelete('role_data', { user_id: userId }, {});
      await queryInterface.bulkDelete('users', { id: userId }, {});
    }
  }
};
