'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      const promises = await Promise.all([
        queryInterface.bulkInsert(
          'roles',
          [
            {
              value: 'ADMIN',
              description: 'Администратор',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          { transaction: t },
        ),
        queryInterface.bulkInsert(
          'users',
          [
            {
              email: process.env.ADMIN_EMAIL_FOR_MIGRATION,
              password: process.env.ADMIN_PASS_FOR_MIGRATION,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          { transaction: t },
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkDelete('roles', null, { transaction: t }),
        queryInterface.bulkDelete('users', null, { transaction: t }),
      ]);
    });
  },
};
