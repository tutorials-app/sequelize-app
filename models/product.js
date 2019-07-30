const Sequelize = require('sequelize');

module.exports = {
    name: 'product',
    schema: {
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        quantity: Sequelize.INTEGER,
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    }
}