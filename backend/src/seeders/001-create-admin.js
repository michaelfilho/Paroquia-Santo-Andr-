const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Admins', [
      {
        username: 'admin',
        password: hashedPassword,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Admins', null, {});
  },
};
