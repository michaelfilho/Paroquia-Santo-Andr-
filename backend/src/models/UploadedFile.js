const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UploadedFile = sequelize.define('UploadedFile', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  folder: {
    type: DataTypes.STRING(120),
    allowNull: false,
    defaultValue: 'geral',
  },
  storedName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'stored_name',
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'original_name',
  },
  mimeType: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'mime_type',
  },
  sizeBytes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'size_bytes',
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },
}, {
  tableName: 'uploaded_files',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['folder', 'stored_name'],
      name: 'uploaded_files_folder_stored_name_unique',
    },
  ],
});

module.exports = UploadedFile;
