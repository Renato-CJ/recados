const mysql = require('mysql2');

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: process.env.DB_HOST,      // Endereço do servidor MySQL
  user: process.env.DB_USER,      // Usuário do MySQL
  password: process.env.DB_PASSWORD,  // Senha do MySQL
  database: process.env.DB_DATABASE,  // Nome do banco de dados
});

// Testa a conexão
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso.');
});

module.exports = connection;
