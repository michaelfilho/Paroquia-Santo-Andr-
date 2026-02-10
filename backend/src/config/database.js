const path = require('path');
const fs = require('fs');

// Garantir que a pasta db existe
const dbDir = path.join(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'paroquia.db');

const toNumberOrUndefined = (value) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const productionDialect = process.env.DB_DIALECT || (process.env.DB_HOST ? 'mysql' : 'sqlite');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions: {
      timeout: 20000,
    },
  },
  production: {
    dialect: productionDialect,
    host: process.env.DB_HOST,
    port: toNumberOrUndefined(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    storage: dbPath,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions: {
      timeout: 20000,
    },
  },
};
