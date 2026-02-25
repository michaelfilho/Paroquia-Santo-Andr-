const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PastoralMovement = sequelize.define('PastoralMovement', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  meetings: {
    type: DataTypes.TEXT
  },
  coordinator: {
    type: DataTypes.STRING(255)
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    field: 'image_url'
  },
  iconUrl: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('imageUrl');
    },
    set(value) {
      this.setDataValue('imageUrl', value);
    }
  }
}, {
  tableName: 'pastorals',
  timestamps: false
});

module.exports = PastoralMovement;