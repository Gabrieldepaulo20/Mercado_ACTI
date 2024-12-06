const bcrypt = require('bcrypt'); // Chamando a biblioteca que irá fazer a criptografia da senha;
const jwt = require('jsonwebtoken'); // Com ela irei criar o token do usuário que relizar o login
const { type } = require('os');
const mysql = require('../aa.db').pool; // Aqui eu criei um documento com as credenciais do meu banco de dados, eu uso o metodo (pool), para exportar essas credenciais;
const path = require('path');

const publicDirectory = path.join(__dirname, './public');

// o "Exports" significa que este caminho está disponível para ser exportado para ou doc de javaScript, onde ele será usado;
exports.register = (req, res) => {

    const { nome, sobreNome, email, number, senha, confirmarSenha, tipo_user} = req.body; // Aqui estou pegando os dados que o usuário envia no front-end;

    let regex_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    let regex_senha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{8,}$/;

    let validando_senha = regex_senha.test(senha);
    let validando_email = regex_email.test(email);
    let type_user = 0;
    
    if(nome == ''|| sobreNome == ''|| email == ''|| number == ''|| senha == ''|| confirmarSenha == '') return res.json({message: "Por favor, preencha todas os campos!"});
    if(!validando_email) return res.json({message: "Formato de e-mail inválido: exemplo@exemplo.com"});
    if(!validando_senha) return res.json({message: "Senha inválida! A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial."})
    if(number.length < 11) return res.json({message: "Tamanho de número invalido!"})

    if(tipo_user == 'on'){
        type_user = 1
    }

    // Aqui faço a conexão padrão com o banco de dados
    mysql.query(`SELECT * FROM tbl_User WHERE email_Login = ?`, [email], async (err, result) => {
        if (err) {
            console.log(err);
        }
        // // Aqui ele me retorna um "result" com os dados do usuário, e com eles eu verifico se já tem um e-mail cadastrado idêntico ao que o usuário informou;
        if (result.length > 0) return res.json({message: "Este e-mail já está cadastrado!", status: "default"});

        // Verificando se ambas as senhas são iguais;
        if (senha !== confirmarSenha) return res.json({message: "Ambas as senhas não coindicem", status: "default"});

        let hashPassword = await bcrypt.hash(senha, 8); // Aqui uso a biblioteca bcrypt, para criptografar a senha informada;

        // Caso tudo estiver okey, o usuário é cadastrado normalmente
        mysql.query('INSERT INTO tbl_User (nome, email_Login, password_Login, telefone, ativo, admin) VALUES (?,?,?,?,?,?);  ', [nome + ' ' + sobreNome, email, hashPassword, number, 1, type_user], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                return res.json({message: "Funcionário cadastrado com sucesso!", status: "sucesso!"});
            }
        });
    });

}

// o "Exports" significa que este caminho está disponível para ser exportado para ou doc de javaScript, onde ele será usado;
exports.login = (req, res) => {

    const { email, senha } = req.body; // Aqui estou pegando os dados que o usuário envia no front-end;
    const query = `SELECT * FROM tbl_User WHERE email_Login = ?;` // Eu separei a query do mysql nesta variável, porém opera da mesma forma.

        // Criando a conexão padrão com o banco de dados
        mysql.query(query, [email], (err, results) => {

            // Verificando se houve algum erro ao conectar com o bando de dados
            if (err) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '00.login.html'), {
                message: "Erro ao conectar com o servidor"
            });

            if (results.length < 1) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '00.login.html'), {
                message: "Usuário incorreto email"
            });
            
            // Verificando se o usuário está ativo ou não, caso não o seu login será rejeitado!
            if(results[0].ativo == 0) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '00.login.html'), {
                message: "Usuário desativado!"
            }); 
            
            bcrypt.compare(senha, results[0].password_Login, (err, result) => {

                if (err) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '00.login.html'), {
                    message: "Usuario incorreto senha"
                });

                if (result) {
                    // res.clearCookie('jwt'); // Aqui a cada nova sessão de login criada, você está limpando a sua variável de token, assim ela irá receber uma nova!

                    // Aqui você está declarando a sua variável de token de acordo com os dados fornecidos pelo usuário.

                    let type_user = 0;

                    if(results[0].admin == 1){
                        type_user = 1;
                     }

                    if(type_user == 1){

                        var token = jwt.sign({
                            id_usuario: results[0].id, // informações do usuário;
                            email: results[0].email // informações do usuário;
                        }, process.env.JWT_KEY, {
                            expiresIn: process.env.JWT_EXPIRE_IN // Aqui você defini em quanto tempo a sessão irá durar, podendo ser um 1h ou dias, eu defini como padrão de 1 hora;
                        });

                    } else {

                        var token = jwt.sign({
                            id_usuario: results[0].id, // informações do usuário;
                            email: results[0].email // informações do usuário;
                        }, process.env.JWT_KEY_USER, {
                            expiresIn: process.env.JWT_EXPIRE_IN // Aqui você defini em quanto tempo a sessão irá durar, podendo ser um 1h ou dias, eu defini como padrão de 1 hora;
                        });

                    }
                    
                    // Aqui é complicado explicar, pessoalmente eu te falo melhor que esse trecho de código faz, porém basicamente ele gera informações de token
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000 // Aqui você defini o quanto tempo o cookie será armazenado no navegador do usuário
                        ),
                        httpOnly: true,
                    }

                    res.cookie('jwt', token, cookieOptions); // Definindo a sua variável de cookie, a qual eu irei usar sempre;
                    res.cookie('name', results[0].nome);
                    res.cookie('email', results[0].email_Login);

                    if(results[0].admin == 1){
                        return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '01.menu.html'));
                    }else{
                        return res.sendFile(path.join(__dirname, '..', 'public', 'store', 'pages', '01.home.html'));
                    }
                }

                return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '00.login.html'), {
                    message: "falha na autenticação"
                })
            })
        })  
}

exports.loginUser = (req, res) => {
    const { email, senha } = req.body; // Aqui estou pegando os dados que o usuário envia no front-end;
    const query = `SELECT * FROM tbl_User WHERE email_Login = ?;` // Eu separei a query do mysql nesta variável, porém opera da mesma forma.

        // Criando a conexão padrão com o banco de dados
        mysql.query(query, [email], (err, results) => {

            // Verificando se houve algum erro ao conectar com o bando de dados
            if (err) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '1000.loginUser.html'), { message: "Erro ao conectar com o servidor" });

            if (results.length < 1) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '1000.loginUser.html'), { message: "Usuário incorreto email" });

            bcrypt.compare(senha, results[0].password_Login, (err, result) => {
                if (err) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '1000.loginUser.html'), { message: "Usuario incorreto senha" });

                if (result) {

                    // res.clearCookie('jwt'); // Aqui a cada nova sessão de login criada, você está limpando a sua variável de token, assim ela irá receber uma nova!

                    // Aqui você está declarando a sua variável de token de acordo com os dados fornecidos pelo usuário.
                    const token = jwt.sign({
                        id_usuario: results[0].id, // informações do usuário;
                        email: results[0].email // informações do usuário;
                    }, process.env.JWT_KEY, {
                        expiresIn: process.env.JWT_EXPIRE_IN // Aqui você defini em quanto tempo a sessão irá durar, podendo ser um 1h ou dias, eu defini como padrão de 1 hora;
                    });

                    // Aqui é complicado explicar, pessoalmente eu te falo melhor que esse trecho de código faz, porém basicamente ele gera informações de token
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000 // Aqui você defini o quanto tempo o cookie será armazenado no navegador do usuário
                        ),
                        httpOnly: true,
                    }

                    res.cookie('jwt', token, cookieOptions); // Definindo a sua variável de cookie, a qual eu irei usar sempre;
                    res.cookie('name', results[0].nome)
                    res.cookie('email', results[0].email_Login)

                    console.log(`cookie novo: ${ token }`)
                    return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '1001.mobile.menu.html'));
                }

                return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '1001.mobile.menu.html'), { message: "falha na autenticação" });
            })
        }) 
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('name');
    res.clearCookie('email');
    return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '00.login.html'));
}
