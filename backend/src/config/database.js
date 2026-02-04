const path = require('path');
const fs = require('fs');

// Garantir que a pasta db existe
const dbDir = path.join(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'paroquia.db');

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
};
