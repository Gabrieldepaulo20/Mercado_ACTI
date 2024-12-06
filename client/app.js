const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' })

const app = express();

const publicDirectory = path.join(__dirname, './public');
const adminDirectory = path.join(__dirname, './public/admin');
const storeDirectory = path.join(__dirname, './public/admin/store');
const imgDirectory = path.join(__dirname, './public/admin/imgs');
const stylePadraoDirectory = path.join(__dirname, './public/admin/style.padrao');
const routesDirectory = path.join(__dirname, './public/routes');


app.use(express.static(publicDirectory));    // Serve arquivos em /public (incluindo admin, imgs, etc)
app.use(express.static(adminDirectory));     // Serve arquivos em /public/admin
app.use(express.static(storeDirectory));     // Serve arquivos em /public/admin/store
app.use(express.static(imgDirectory));       // Serve arquivos em /public/admin/imgs
app.use(express.static(stylePadraoDirectory)); // Serve arquivos em /public/admin/style.padrao
app.use(express.static(routesDirectory));


app.use(cookieParser());

app.use(express.urlencoded({extended: false})); // envia os dados para o seu server
app.use(express.json()); // transforma os dados enviados em Json;

// Definição das rotas
const rotaAuth= require('./routes/auth');
const rotaReqGeral = require('./routes/requisicoes');
const rotasPaginas = require('./routes/paginas');

app.use('/', rotaAuth);
app.use('/', rotaReqGeral);
app.use('/', rotasPaginas);

// Conexão com o banco
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASEYES
})

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL connected...");
    }
});

app.listen(5000, '0.0.0.0', () => {
    console.log("Server started on port 5000");
});

// Rota para a página inicial (exemplo)
app.get('/', (req, res) => {
    res.sendFile(path.join(adminDirectory, 'pages', '00.login.html'));
});

