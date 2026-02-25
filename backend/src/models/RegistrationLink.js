const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const RegistrationLink = sequelize.define('RegistrationLink', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  formUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'form_url',
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'registration_links',
  timestamps: true,
  underscored: true,
});

module.exports = RegistrationLink;
