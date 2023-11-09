## Script DB

CREATE DATABASE db_teams;
USE db_teams;

CREATE TABLE equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

CREATE TABLE canal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_equipo INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    FOREIGN KEY (fk_equipo) REFERENCES equipo(id)
);

CREATE TABLE mensaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_canal INT NOT NULL,
    nombre_usuario VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    FOREIGN KEY (fk_canal) REFERENCES canal(id)
);