CREATE DATABASE ecommerce;
drop database ecommerce;
-- to use database
use ecommerce;
-- creating a new table
CREATE TABLE users (
  id INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  last_name varchar(150),
  nationality varchar(100),
  date_birth date,
  document varchar (20),
  pass VARCHAR(150),
  rol VARCHAR(50),
  gender varchar(20),
  email varchar(150),
  num varchar (10)
);

CREATE TABLE products (
  id_product INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  price DOUBLE(18, 6),
  image text,
  descrption text
);

CREATE TABLE size (
  id_size INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
uno_dos int(150),
tres_cuatro int(150),
cinco_seis int(150),
siete_ocho int(150),
nueve_diez int(150),
once_doce int(150),
  id_product INT(6),
  CONSTRAINT id_size FOREIGN KEY (id_product)
    REFERENCES products(id_product)
);
CREATE TABLE pedido (
  id_pedido INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
nombres varchar(100),
apellidos varchar(100),
correo varchar(150),
numero varchar(10),
direccion varchar(100),
valor_total DOUBLE(18, 6),
 fecha datetime DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE pedido_detalle (
  id_pedido_detalle INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
cantidad int(100),
valor_unidad DOUBLE(18, 6),
valor_total DOUBLE(18, 6),
talla varchar(10),
  id_product INT(6),
  CONSTRAINT id_pedido_detalle FOREIGN KEY (id_product)
    REFERENCES products(id_product)
);

drop table products;
-- to show all tables
show tables;
select * from products;