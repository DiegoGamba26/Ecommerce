const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'ecommerce'
});
mysqlConnection.connect(err => {
    if (err) {
        console.log('HAY UN ERROR EN LA BASE DE DATOS EL CUAL ES EL SIGUIENTE: ', err);
        return;
    } else {
        console.log('BASE DE DATOS OK');
    }

});
module.exports = mysqlConnection;