const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

// Rota de exemplo para teste de bcrypt
app.post('/login', (req, res) => {
    const { password, hashedPassword } = req.body;
    bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (result) {
            return res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            return res.status(401).json({ message: 'Senha incorreta' });
        }
    });
});

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor Node.js em execução!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
