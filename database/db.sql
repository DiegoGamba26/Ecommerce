-- to create a new database
CREATE DATABASE divisas;
drop database divisas;
-- to use database
use divisas;

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
  num varchar (10),
  balance DOUBLE(18, 6)
);

CREATE TABLE transactions (
  id_transactions INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  last_name varchar(150),
  nationality varchar(100),
  document varchar (20),
  bank varchar(50),
  type varchar (50),
  amount DOUBLE(18, 6),
  transaction_date datetime DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,
  id INT(6),
  CONSTRAINT id_transactions FOREIGN KEY (id)
    REFERENCES users(id)
);


drop table users;
-- to show all tables
show tables;
select * from transactions;