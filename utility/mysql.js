const mysql = require('mysql')

const connection = mysql.createConnection({
    host: process.env.npm_package_configs_mysql_host,
    port: process.env.npm_package_configs_mysql_port,
    user: process.env.npm_package_configs_mysql_user,
    password: process.env.npm_package_configs_mysql_password,
    database: process.env.npm_package_configs_mysql_database,
});

module.exports = connection;