const jwt = require('jsonwebtoken');
const path = require('path');

exports.loginUser = (req, res, next) => {
    try {

        if (!req.cookies.jwt) {
            throw new Error('Token não encontrado');
        }

        const decode = jwt.verify(req.cookies.jwt, process.env.JWT_KEY_USER)
        req.usuario = decode;
        next()
    } catch (error) {
        return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '00.login.html'), {
            message: "Necessário relizar o login novamente"
        });
    }
    
}
