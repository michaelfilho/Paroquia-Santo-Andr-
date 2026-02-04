const { Sequelize } = require('sequelize');
const databaseConfig = require('./database');

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

console.log('⚙️  Configurando Sequelize com dialect:', config.dialect);
console.log('📁 Storage:', config.storage);

let sequelize;

if (config.dialect === 'sqlite') {
  // Para SQLite, passar storage diretamente
  sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: config.logging,
    define: config.define,
    dialectOptions: config.dialectOptions,
  });
} else {
  // Para outros bancos (PostgreSQL, MySQL, etc)
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging,
      define: config.define,
    }
  );
}

module.exports = sequelize;

