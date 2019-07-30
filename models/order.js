const Sequelize = require('sequelize');

module.exports = {
    name: 'order',
    schema: {
        quantity: Sequelize.INTEGER,
        amount: Sequelize.FLOAT,
    },
    belongs: ['user', 'product']
}