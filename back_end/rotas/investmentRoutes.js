const express = require('express');
const Investments = require('../modulos/Investments');

const router = express.Router();

// Middleware para verificar autenticação
router.use((req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Não autenticado.' });
    }
    next();
});

// Obter investimentos
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log('userId da sessão:', userId);

        const resultado = await Investments.sessaoInvestimento(userId);
        res.status(200).json(resultado);
    } catch (erro) {
        res.status(500).json({ error: 'Erro ao buscar investimentos.' });
    }
});

// Adicionar investimento
router.post('/', async (req, res) => {
    try {
        const { ticker, value, quantity } = req.body;
        const userId = req.session.userId;

        console.log('Dados recebidos para o novo investimento:', { ticker, value, quantity, userId });

        const resultado = await Investments.adicionarInvestimento(userId, ticker, value, quantity);
        res.status(200).json({ message: 'Investimento adicionado com sucesso!', data: resultado });
    } catch (erro) {
        res.status(500).json({ error: 'Erro ao adicionar investimento.' });
    }
});

// Editar Investimento
router.put('/:id', async (req, res) => {
    try {
        const { ticker, value, quantity } = req.body;
        const { id } = req.params;
        const userId = req.session.userId;

        const resultado = await Investments.atualizarInvestimento(ticker, value, quantity, id, userId);
        res.status(200).json({ message: 'Investimento atualizado com sucesso!', data: resultado });
    } catch (erro) {
        res.status(500).json({ error: 'Erro ao atualizar investimento.' });
    }
});

// Excluir investimento
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        const resultado = await Investments.deletarInvestimento(id, userId);
        res.status(200).json({ message: 'Investimento excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir investimento.' });
    }
});

module.exports = router;
