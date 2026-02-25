const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Chapel = sequelize.define('Chapel', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  street: {
    type: DataTypes.STRING(255)
  },
  address: {
    type: DataTypes.STRING(255),
    field: 'street'
  },
  neighborhood: {
    type: DataTypes.STRING(255)
  },
  number: {
    type: DataTypes.STRING(50)
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    field: 'image_url' // Mapeia p/ o campo no banco mantendo JS snake_case
  },
  photoUrl: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('imageUrl');
    },
    set(value) {
      this.setDataValue('imageUrl', value);
    }
  },
  coordinator: {
    type: DataTypes.STRING(255)
  },
  phone: {
    type: DataTypes.STRING(50)
  },
  email: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'chapels',
  timestamps: false
});

module.exports = Chapel;
