const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FormerPriest = sequelize.define('FormerPriest', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  period: {
    type: DataTypes.STRING(50)
  },
  subtext: {
    type: DataTypes.STRING(120)
  },
  bio: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('bio');
    },
    set(value) {
      this.setDataValue('bio', value);
    }
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    field: 'image_url'
  }
}, {
  tableName: 'old_priests',
  timestamps: false
});

module.exports = FormerPriest;