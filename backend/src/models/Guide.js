const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Guide = sequelize.define('Guide', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  details: {
    type: DataTypes.JSON
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    field: 'image_url'
  }
}, {
  tableName: 'guides',
  timestamps: false
});

module.exports = Guide;
