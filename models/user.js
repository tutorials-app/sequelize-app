const Sequelize = require('sequelize');

module.exports = {
    name: 'user',
    schema: {
        username: Sequelize.STRING,
        birthday: Sequelize.DATE
    }
}