'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const role = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE value = 'ADMIN'",
      { raw: true },
    );
    const user = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = '" +
        process.env.ADMIN_EMAIL_FOR_MIGRATION +
        "'",
      { raw: true },
    );

    await queryInterface.bulkInsert('users_roles', [
      {
        roleId: role[0][0].id,
        userId: user[0][0].id,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_roles', null);
  },
};
