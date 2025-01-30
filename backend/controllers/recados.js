const connection = require("../config/db");

const listarRecados = (req, res) => {
    const query = "SELECT * FROM recados";
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar recados." });
        }
        res.json(results);
    });
};

const criarRecado = (req, res) => {
    const { conteudo, usuario_id } = req.body;
    if (!conteudo || !usuario_id) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const query = "INSERT INTO recados (conteudo, usuario_id) VALUES (?, ?)";
    connection.query(query, [conteudo, usuario_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao criar recado." });
        }
        res.status(201).json({ message: "Recado criado com sucesso!", id: results.insertId });
    });
};

module.exports = { listarRecados, criarRecado };
