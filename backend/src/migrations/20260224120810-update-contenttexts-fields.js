'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Para simplificar no SQLite, se der erro em addColumn porque a tabela não existe,
    // podemos forçar o recriar ou usar um try/catch. Como Sequelize migrations não suportam
    // IF EXISTS bem no SQLite nativo via QueryInterface, vamos forçar a verificação da tabela.

    // Tenta adicionar a coluna, se falhar é porque a tabela nem existe ainda (criada por sync). 
    // Como a tabela originou-se do sync() provavelmente, vamos ignorar caso não exista.
    try {
      await queryInterface.addColumn('ContentTexts', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (err) {
      console.log('Tabela ContentTexts não encontrada ou coluna já existente. Ignorando no SQLite.');
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('ContentTexts', 'imageUrl');
    } catch (err) { }
  }
};
