const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    timeStart: {
        type: DataTypes.STRING(50),
        field: 'time_start'
    },
    timeEnd: {
        type: DataTypes.STRING(50),
        field: 'time_end'
    },
    location: {
        type: DataTypes.STRING(255)
    },
    category: {
        type: DataTypes.STRING(100)
    },
    description: {
        type: DataTypes.TEXT
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_published'
    }
}, {
    tableName: 'schedules',
    timestamps: false
});

module.exports = Schedule;
