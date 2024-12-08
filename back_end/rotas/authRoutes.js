const express = require('express');
const User = require("../modulos/User.js");

const router = express.Router();

// Rota de registro de usuário
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await User.registrar(email, password);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Rota de login de usuário
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email);
        if (!user || user.password !== password) {
            res.status(401).json({ error: 'Credenciais inválidas.' });
        } else {
            req.session.userId = user.id;  // Armazene o ID do usuário na sessão
            res.status(200).json({ message: 'Login bem-sucedido!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar o banco.' });
    }
});

// Rota de logout de usuário
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao fazer logout.' });
        } else {
            res.status(200).json({ message: 'Logout realizado com sucesso.' });
        }
    });
});

module.exports = router;
