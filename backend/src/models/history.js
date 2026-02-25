const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const History = sequelize.define('History', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING(255)
    },
    content: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'history',
    timestamps: false
});

module.exports = History;
