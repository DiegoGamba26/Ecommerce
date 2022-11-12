const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: mysql
});
console.log(process.env.DB_NAME);
mysqlConnection.connect(err => {
    if (err) {
        console.log('HAY UN ERROR EN LA BASE DE DATOS EL CUAL ES EL SIGUIENTE: ', err);
        return;
    } else {
        console.log('BASE DE DATOS OK');
    }

});
module.exports = mysqlConnection;