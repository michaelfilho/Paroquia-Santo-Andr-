const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const CarouselItem = sequelize.define('CarouselItem', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING(255)
    },
    titleHighlight: {
        type: DataTypes.STRING(255),
        field: 'title_highlight'
    },
    subtitle: {
        type: DataTypes.STRING(255)
    },
    description: {
        type: DataTypes.TEXT
    },
    link: {
        type: DataTypes.STRING(255)
    },
    buttonText: {
        type: DataTypes.STRING(80),
        defaultValue: 'Saiba Mais',
        field: 'button_text'
    },
    titleColor: {
        type: DataTypes.STRING(20),
        defaultValue: '#FFFFFF',
        field: 'title_color'
    },
    titleColorEnd: {
        type: DataTypes.STRING(20),
        defaultValue: '#F59E0B',
        field: 'title_color_end'
    },
    subtitleColor: {
        type: DataTypes.STRING(20),
        defaultValue: '#F3F4F6',
        field: 'subtitle_color'
    },
    linkColor: {
        type: DataTypes.STRING(20),
        defaultValue: '#FFFFFF',
        field: 'link_color'
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        field: 'image_url'
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'carousel',
    timestamps: false
});

module.exports = CarouselItem;
