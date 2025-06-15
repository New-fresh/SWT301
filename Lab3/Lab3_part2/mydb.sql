CREATE DATABASE mydb;

USE mydb;

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(100) NOT NULL
);

-- Thêm 1 dòng để test
INSERT INTO users (username) VALUES ('admin');