const Sequelize = require("sequelize")

const connection = new Sequelize('guiapress','root', 'M@t27111829',{
    host:"localhost",
    dialect:"mysql",
    timezone:"-03:00"
});

module.exports = connection;
