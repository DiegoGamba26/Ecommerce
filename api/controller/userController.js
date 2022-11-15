const { query } = require('express');
const { json } = require('express/lib/response');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const controller = {};
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_51M43R9KwKL8b7Q9tgNZM4Gkcl0Hdm742nNRH6uwr2J8yFz36Alg0Bk1g8orwaFAVmCi3wAhg4C74PD3p47QPsWnl00p24G7KVx');

const mysqlConnection = require('../model/connection');
controller.list = (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            res.status(200).json('HUBO UN ERROR PAPU');
        }
    });
};

controller.profile = (req, res) => {
    const document = req.params.document;
    console.log(document);
    mysqlConnection.query('SELECT * FROM users WHERE document =?', [document], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            res.status(200).json('HUBO UN ERROR PAPU');
        }
    });
};

controller.profileUpdate = (req, res) => {
    const document = req.params.document;
    const {
        name, last_name, nationality, date_birth, document1,
        gender, email, num, pass, rol
    } = req.body;
    console.log(document);
    mysqlConnection.query('UPDATE users  SET name=?, last_name=?,nationality=?,date_birth=?,document=?,pass=?,rol=?,gender=?,email=? WHERE document =?', [name, last_name, nationality, date_birth, document1,
        pass, rol, gender, email, document], (err, rows, fields) => {
            if (!err) {
                res.status(200).json(rows);
            } else {
                res.status(200).json('HUBO UN ERROR PAPU');
            }
        });
};


controller.register = (req, res) => {
    const {
        name, last_name, nationality, date_birth, document,
        gender, email, num, pass, rol
    } = req.body;
    console.log(req.body);
    mysqlConnection.query('SELECT * FROM users WHERE document =? ', [document],
        (err, rows, fields) => {
            if (!err) {
                if (rows = []) {
                    mysqlConnection.query('INSERT INTO users SET name =?,last_name=?, nationality=?,date_birth=?,document=?,gender=?, email=?, num=?, pass=?, rol =?', [name, last_name, nationality, date_birth, document, gender, email, num, pass, rol], (err, rows, fields) => {
                        if (!err) {
                            res.status(200).json("Correcto calvo hijueputaXD");
                        } else {
                            res.status(200).json("YA EXISTE ESTA CÉDULA PAPU XD");
                        }
                    });
                }
            } else {
                res.status(200).json('HUBO UN ERROR PAPU');
            }
        });
    /* */
};

controller.transfer = (req, res) => {
    const { document } = req.params;
    const { balance, bank, document2 } = req.body;
    mysqlConnection.query('SELECT balance FROM users WHERE document =?', [document],
        (err, rows, fields) => {
            if (rows == []) {
                return res.status(200).json("No existe el documento");
            }
            if (!err) {
                let result = rows[0]["balance"];
                if (balance > result) {
                    res.status(200).json("No hay fondos suficientes en su cuenta revise por favor perro hijueputa");
                } else {
                    mysqlConnection.query('SELECT balance FROM users WHERE document =?', [document2],
                        (err, rows, fields) => {
                            let saldo = rows.length ? rows[0].balance : null;
                            if (saldo == null) {
                                return res.status(200).json("No existe el documentos");
                            }
                            if (!err) {

                                mysqlConnection.query('UPDATE users set balance = ? WHERE document =?', [balance + saldo, document2],
                                    (err, rows, fields) => {
                                        if (!err) {
                                            const rest = result - balance;
                                            mysqlConnection.query('UPDATE users set balance = ? WHERE document =?', [rest, document],
                                                (err, rows, fields) => {
                                                    if (!err) {
                                                        mysqlConnection.query('SELECT * FROM users WHERE document =? ', [document],
                                                            (err, rows, fields) => {
                                                                if (!err) {
                                                                    let name = rows[0]["name"];
                                                                    let last_name = rows[0]["last_name"];
                                                                    let country = rows[0]["nationality"];
                                                                    let id_transaction = rows[0]["id"];

                                                                    let type = "salida";
                                                                    mysqlConnection.query('INSERT INTO transactions set name=?,last_name=?,nationality=?,type=?, amount = ?, document=?, bank=?,id=?', [name, last_name, country, type, balance, document, bank, id_transaction],
                                                                        (err, rows, fields) => {
                                                                            if (!err) {
                                                                                mysqlConnection.query('SELECT * FROM users WHERE document =? ', [document2],
                                                                                    (err, rows, fields) => {
                                                                                        if (!err) {
                                                                                            let name = rows[0]["name"];
                                                                                            let last_name = rows[0]["last_name"];
                                                                                            let country = rows[0]["nationality"];
                                                                                            let id_transaction = rows[0]["id"];
                                                                                            let type = "entrada";
                                                                                            mysqlConnection.query('INSERT INTO transactions set name=?,last_name=?,nationality=?,type=?, amount = ?, document=?, bank=?,id=?', [name, last_name, country, type, balance, document2, bank, id_transaction],
                                                                                                (err, rows, fields) => {
                                                                                                    if (!err) {
                                                                                                        res.status(200).json("Correcto calvo");
                                                                                                    } else {
                                                                                                        res.status(200).json('HUBO UN ERROR PAPU4');
                                                                                                    }
                                                                                                });
                                                                                        } else {
                                                                                            res.status(200).json('HUBO UN ERROR PAPU3');
                                                                                        }
                                                                                    });
                                                                            } else {
                                                                                res.status(200).json('HUBO UN ERROR PAPU4');
                                                                            }
                                                                        });
                                                                } else {
                                                                    res.status(200).json('HUBO UN ERROR PAPU3');
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                        else {
                                            res.status(200).json('HUBO UN ERROR PAPU');
                                        }

                                    });
                            } else {
                                res.status(200).json('El usuario al que intenta ingresar la plata no está registrado');
                            }

                        });
                }
            } else {
                res.status(200).json('HUBO UN ERROR PAPU');
            }

        });
};
controller.login = (req, res) => {
    const { email, pass } = req.body;
    mysqlConnection.query('SELECT id,rol,name,last_name,document FROM users WHERE email =? and pass=?', [email, pass],
        (err, rows, fields) => {
            if (err == null && rows.length > 0) {
                jwt.sign(req.body, 'DIEGO', { expiresIn: '8h' }, (err, token) => {
                    res.status(200).json({ token, rows, response: true });
                });

            } else {
                res.status(200).json({ response: false, mensaje: 'Revisa tu usuario y contraseña' });
            }

        });
};
controller.products_insert = (req, res) => {
    if (req.headers.authorization == "") {
        return res.status(401).json("TOKEN VACÍO");
    }
    let token = req.headers.authorization.substr(7);
    try {
        jwt.verify(token, 'DIEGO');
        const {
            name, price, size, image
        } = req.body;
        mysqlConnection.query('INSERT INTO products SET name =?,price=?, size=?,image=?', [name, price, size, image], (err, rows, fields) => {
            if (!err) {
                res.status(200).json("Correcto calvo hijueputaXD");
            } else {
                res.status(200).json("NO SE REGISTRÓ");
            }
        });
    } catch (error) {
        return res.status(401).json("TOKEN VACÍO,EXPIRADO O INCORRECTO");
    }
};


controller.products_consult = (req, res) => {
    mysqlConnection.query('SELECT * FROM products ', [document], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            res.status(200).json('HUBO UN ERROR PAPU');
        }
    });
};
controller.verify = (req, res) => {
    if (req.headers.authorization == "") {
        return res.status(401).json("TOKEN VACÍO");
    }
    let token = req.headers.authorization.substr(7);
    try {
        jwt.verify(token, 'DIEGO');
        res.status(200).json({response: true });
    } catch (error) {
        return res.status(401).json("TOKEN VACÍO,EXPIRADO O INCORRECTO");
    }
};

controller.checkout = async (req, res) => {
    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    });
    const charge = await stripe.charges.create({
        amount: '3000',
        currency: 'usd',
        customer: customer.id,
        description: 'Colombian jeans'
    });
   res.status(200).json("ALL good");
};
module.exports = controller;