CREATE DATABASE site_recados;

USE site_recados;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    tipo ENUM('admin', 'comum') DEFAULT 'comum'
);

CREATE TABLE recados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conteudo TEXT,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    autor INT,
    imagem VARCHAR(255),
    FOREIGN KEY (autor) REFERENCES usuarios(id)
);
