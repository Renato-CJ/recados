require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do Banco de Dados
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'site_recados'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

// Middleware para verificar token JWT
const autenticarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ mensagem: 'Token não fornecido' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'chave_secreta', (err, user) => {
        if (err) return res.status(403).json({ mensagem: 'Token inválido' });
        req.user = user;
        next();
    });
};

// Rota inicial
app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

// Cadastro de usuário
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) return res.status(500).json({ mensagem: 'Erro ao criptografar senha' });

        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        db.query(query, [nome, email, hash], (err) => {
            if (err) return res.status(500).json({ mensagem: 'Erro no cadastro' });
            res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
        });
    });
});

// Login de usuário
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ mensagem: 'Erro no servidor' });
        if (results.length === 0) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

        const user = results[0];
        bcrypt.compare(senha, user.senha, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).json({ mensagem: 'Senha incorreta' });

            const token = jwt.sign({ id: user.id, tipo: user.tipo }, process.env.JWT_SECRET || 'chave_secreta', { expiresIn: '1h' });
            res.json({ token });
        });
    });
});

// Listar recados
app.get('/recados', autenticarToken, (req, res) => {
    db.query('SELECT * FROM recados', (err, results) => {
        if (err) return res.status(500).json({ mensagem: 'Erro no servidor' });
        res.json(results);
    });
});

// Criar recado
app.post('/recados', autenticarToken, (req, res) => {
    const { conteudo, imagem } = req.body;
    const query = 'INSERT INTO recados (conteudo, autor, imagem) VALUES (?, ?, ?)';
    db.query(query, [conteudo, req.user.id, imagem], (err) => {
        if (err) return res.status(500).json({ mensagem: 'Erro ao criar recado' });
        res.json({ mensagem: 'Recado criado com sucesso!' });
    });
});

// Editar recado
app.put('/recados/:id', autenticarToken, (req, res) => {
    const { conteudo, imagem } = req.body;
    const { id } = req.params;
    const query = 'UPDATE recados SET conteudo = ?, imagem = ? WHERE id = ?';
    db.query(query, [conteudo, imagem, id], (err) => {
        if (err) return res.status(500).json({ mensagem: 'Erro ao atualizar recado' });
        res.json({ mensagem: 'Recado atualizado com sucesso!' });
    });
});

// Excluir recado
app.delete('/recados/:id', autenticarToken, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM recados WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ mensagem: 'Erro ao excluir recado' });
        res.json({ mensagem: 'Recado excluído com sucesso!' });
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
