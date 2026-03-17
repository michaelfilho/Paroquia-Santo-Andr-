module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Alterar o tipo de coluna time_start de VARCHAR(10) para VARCHAR(50)
      await queryInterface.changeColumn('schedules', 'time_start', {
        type: Sequelize.STRING(50),
        allowNull: true,
      });

      // Alterar o tipo de coluna time_end de VARCHAR(10) para VARCHAR(50)
      await queryInterface.changeColumn('schedules', 'time_end', {
        type: Sequelize.STRING(50),
        allowNull: true,
      });

      console.log('✅ Migração concluída: timeStart e timeEnd aumentados para 50 caracteres');
    } catch (error) {
      console.error('❌ Erro na migração:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Reverter para VARCHAR(10) se necessário
      await queryInterface.changeColumn('schedules', 'time_start', {
        type: Sequelize.STRING(10),
        allowNull: true,
      });

      await queryInterface.changeColumn('schedules', 'time_end', {
        type: Sequelize.STRING(10),
        allowNull: true,
      });

      console.log('✅ Migração revertida: timeStart e timeEnd retornados para 10 caracteres');
    } catch (error) {
      console.error('❌ Erro ao reverter migração:', error.message);
      throw error;
    }
  },
};
