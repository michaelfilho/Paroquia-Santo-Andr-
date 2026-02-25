const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  summary: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATEONLY
  },
  publishedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      const value = this.getDataValue('date');
      return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : null;
    },
    set(value) {
      if (!value) {
        this.setDataValue('date', null);
        return;
      }
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        this.setDataValue('date', parsed.toISOString().slice(0, 10));
      }
    }
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    field: 'image_url'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  }
}, {
  tableName: 'news',
  timestamps: false
});

module.exports = News;