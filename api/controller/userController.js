const { query } = require('express');
const { json } = require('express/lib/response');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const controller = {};
const jwt = require('jsonwebtoken');

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
controller.balance = (req, res) => {
    const id = req.params.id;
    mysqlConnection.query('SELECT balance FROM users WHERE id =?', [id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
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

controller.historyTransactions = (req, res) => {
    const id = req.query.id;
    mysqlConnection.query('SELECT id_transactions,name,last_name,nationality,document,bank,type,amount,transaction_date FROM transactions WHERE id =? order by id_transactions asc', [id], (err, rows, fields) => {
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
        gender, email, num, pass
    } = req.body;
    console.log(req.body);
    mysqlConnection.query('SELECT * FROM users WHERE document =? ', [document],
        (err, rows, fields) => {
            if (!err) {
                if (rows = []) {
                    mysqlConnection.query('INSERT INTO users SET name =?,last_name=?, nationality=?,date_birth=?,document=?,gender=?, email=?, num=?, pass=?, balance = 0', [name, last_name, nationality, date_birth, document, gender, email, num, pass], (err, rows, fields) => {
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
controller.topUpBalance = (req, res) => {
    const { document } = req.params;
    const { balance, bank } = req.body;
    mysqlConnection.query('SELECT balance FROM users WHERE document =?', [document],
        (err, rows, fields) => {
            if (!err) {
                let result = rows[0]["balance"];
                mysqlConnection.query('UPDATE users set balance = ? WHERE document =?', [balance + result, document],
                    (err, rows, fields) => {
                        if (!err) {
                            mysqlConnection.query('SELECT * FROM users WHERE document =? ', [document],
                                (err, rows, fields) => {
                                    if (!err) {
                                        let name = rows[0]["name"];
                                        let last_name = rows[0]["last_name"];
                                        let country = rows[0]["nationality"];
                                        let id_transaction = rows[0]["id"];

                                        let type = "recarga";
                                        mysqlConnection.query('INSERT INTO transactions set name=?,last_name=?,nationality=?,type=?, amount = ?, document=?, bank=?,id=?', [name, last_name, country, type, balance, document, bank, id_transaction],
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
                            res.status(200).json('HUBO UN ERROR PAPU2');
                        }
                    });
            } else {
                res.status(200).json('HUBO UN ERROR PAPU1');
            }

        });
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
controller.verify = (req, res) => {
    verifyToken(req, res);
    res.json('INFORMACIÓN SECRETA PAPI NO SEA SAPO MIJO');
};
controller.currency_list = (req, res) => {
    const id = req.params.id;
    mysqlConnection.query('SELECT balance FROM users WHERE id =?', [id], (err, rows, fields) => {
        if (!err) {
            fetch("https://v6.exchangerate-api.com/v6/e1fb2a5953edbe689c1af854/latest/COP")
                .then(response => response.text())
                .then(result => {
                    let result_balance = rows[0]["balance"];
                    let USD = JSON.parse(result).conversion_rates.USD;
                    let USD2 = parseFloat(USD.toFixed(5));
                    let result_usd = (result_balance * USD2) / 1;
                    let GBP = JSON.parse(result).conversion_rates.GBP;
                    let GBP2 = parseFloat(GBP.toFixed(5));
                    let result_gbp = (result_balance * GBP2) / 1;
                    let EUR = JSON.parse(result).conversion_rates.EUR;
                    let EUR2 = parseFloat(EUR.toFixed(5));
                    let result_eur = (result_balance * EUR2) / 1;
                    let CAD = JSON.parse(result).conversion_rates.CAD;
                    let CAD2 = parseFloat(CAD.toFixed(5));
                    let result_cad = (result_balance * CAD2) / 1;
                    let JPY = JSON.parse(result).conversion_rates.JPY;
                    let JPY2 = parseFloat(JPY.toFixed(5));
                    let result_jpy = (result_balance * JPY2) / 1;
                    let BRL = JSON.parse(result).conversion_rates.BRL;
                    let BRL2 = parseFloat(BRL.toFixed(5));
                    let result_brl = (result_balance * BRL2) / 1;
                    let MXN = JSON.parse(result).conversion_rates.MXN;
                    let MXN2 = parseFloat(MXN.toFixed(5));
                    let result_mxn = (result_balance * MXN2) / 1;
                    let RUB = JSON.parse(result).conversion_rates.RUB;
                    let RUB2 = parseFloat(RUB.toFixed(5));
                    let result_rub = (result_balance * RUB2) / 1;
                    res.status(200).json({
                        Balance: result_balance, USD: result_usd, EUR: result_eur,
                        GBP: result_gbp, CAD: result_cad, JPY: result_jpy, BRL: result_brl, MXN: result_mxn, RUB: result_rub
                    });

                })
                .catch(error => console.log('error', error));

        } else {
            res.status(200).json('HUBO UN ERROR PAPU');
        }
    });


};

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json('NO AUTORIZADO MK');
    } else {
        let token = req.headers.authorization.substr(7);
        if (token !== '') {
            const content = jwt.verify(token, 'DIEGO');
            req.data = content;
        } else {
            res.status(200).json('HUBO UN ERROR PAPU');
        }
    }
}

module.exports = controller;