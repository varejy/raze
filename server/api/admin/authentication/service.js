import jsonwebtoken from 'jsonwebtoken';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';

import uniqid from 'uniqid';

import getRecoveryEmailTemplate from './templates/recoveryEmail';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import { getAdminByLogin, getAdminByEmail, changeCredentials as changeCredentialsQuery, addAdmin, sendRecoveryEmail } from './queries';

const privateKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPrivateKey.ppk'), 'utf8');
const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

export function authenticate (req, res) {
    const { login, password } = req.body;

    getAdminByLogin(login)
        .then((admin) => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            if (admin.password !== md5(password)) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.sign(admin.toJSON(), privateKey, {
                algorithm: 'RS256',
                expiresIn: '24h'
            }, (err, token) => {
                if (err || !token) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                res.status(OKEY_STATUS_CODE).json({
                    token: token
                });
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}

export function checkAuthentication (req, res) {
    const token = req.query.token;

    if (!token) {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }

    jsonwebtoken.verify(token, publicKey, {
        algorithm: 'RS256'
    }, err => {
        if (err) {
            return res.status(FORBIDDEN_STATUS_CODE).end();
        }

        res.status(OKEY_STATUS_CODE).end();
    });
}

export function recover (req, res) {
    const email = req.query.email;

    getAdminByEmail(email)
        .then(admin => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.sign(admin.toJSON(), privateKey, {
                algorithm: 'RS256',
                expiresIn: '24h'
            }, (err, token) => {
                if (err || !token) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                const subject = 'Восстановление учетной записи';
                const host = req.get('host');
                const recoveryUrl = `${req.protocol}://${host}/admin/recovery?recovery-token=${token}&&email=${admin.email}`;
                const successCallback = () => res.sendStatus(OKEY_STATUS_CODE);
                const failureCallback = () => res.sendStatus(SERVER_ERROR_STATUS_CODE);

                sendRecoveryEmail(admin.email, subject, getRecoveryEmailTemplate(recoveryUrl), successCallback, failureCallback);
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}

export function checkRecoveryToken (req, res) {
    const { token, email } = req.query;

    if (!token || !email) {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }

    getAdminByEmail(email)
        .then((admin) => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.verify(token, publicKey, {
                algorithm: 'RS256'
            }, err => {
                if (err) {
                    return res.status(FORBIDDEN_STATUS_CODE).end();
                }

                res.status(OKEY_STATUS_CODE).end();
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}

export function changeCredentials (req, res) {
    const { oldCredentials = {}, newCredentials = {} } = req.body;

    getAdminByLogin(oldCredentials.login)
        .then((admin) => {
            if (admin.password !== md5(oldCredentials.password)) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            changeCredentialsQuery({
                login: newCredentials.login,
                password: md5(newCredentials.password),
                email: newCredentials.email,
                id: admin.id
            })
                .then(() => {
                    res.status(OKEY_STATUS_CODE).end();
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}

export function changeRecoveryCredentials (req, res) {
    const { recovery = {}, newCredentials = {} } = req.body;

    getAdminByEmail(recovery.email)
        .then((admin) => {
            if (!admin) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.verify(recovery.token, publicKey, {
                algorithm: 'RS256'
            }, err => {
                if (err) {
                    return res.status(FORBIDDEN_STATUS_CODE).end();
                }

                changeCredentialsQuery({
                    login: newCredentials.login,
                    password: md5(newCredentials.password),
                    email: newCredentials.email,
                    id: admin.id
                })
                    .then(() => {
                        res.status(OKEY_STATUS_CODE).end();
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            });
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}

export function createTestAdmin (req, res) {
    const testAdmin = {
        login: 'admin',
        password: md5('admin'),
        email: 'dev.occam@gmail.com',
        id: uniqid()
    };

    addAdmin(testAdmin)
        .then(() => {
            res.status(OKEY_STATUS_CODE).end();
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}
