const jwt = require('jsonwebtoken');

const loginUsuario = (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  const query = "SELECT * FROM usuarios WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar usuário." });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado!" });
    }

    const usuario = results[0];

    bcrypt.compare(senha, usuario.senha, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: "Senha incorreta!" });
      }

      const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Login realizado com sucesso!", token });
    });
  });
};

module.exports = { criarUsuario, loginUsuario };
