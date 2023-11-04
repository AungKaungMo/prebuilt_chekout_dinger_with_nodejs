const sequelize = require('sequelize');
const db = require('../config/dbConfig');
var user = db.define(
    "user",
    {
        id: { type: sequelize.INTEGER, primaryKey: true},
        username: { type: sequelize.STRING },
        password: { type: sequelize.STRING },
        token: { type: sequelize.STRING }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
)

module.exports = user;

