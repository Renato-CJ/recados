const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const rotasUsuario = require("./routes/usuarios");
const rotasRecados = require("./routes/recados");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/usuarios", rotasUsuario);
app.use("/recados", rotasRecados);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
