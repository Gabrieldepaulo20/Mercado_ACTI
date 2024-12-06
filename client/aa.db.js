const mysql = require('mysql2');

// Aqui você está usando as variáveis de ambiente do seu computador, para assim então ter maior segurança;

var pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.pool = pool;
