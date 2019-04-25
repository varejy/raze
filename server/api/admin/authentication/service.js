import jsonwebtoken from 'jsonwebtoken';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import { getAdminByLogin, addAdmin } from './queries';

const privateKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPrivateKey.ppk'), 'utf8');
const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

export function authenticate (req, res) {
    const { login, password } = req.body;

    getAdminByLogin(login)
        .then((admin) => {
            if (admin.password !== md5(password)) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            jsonwebtoken.sign(admin.toJSON(), privateKey, {
                algorithm: 'RS256',
                expiresIn: '1440m' // expires in 24 hours
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
        algorithm: 'RS256',
        expiresIn: '1440m' // expires in 24 hours
    }, err => {
        if (err) {
            return res.status(FORBIDDEN_STATUS_CODE).end();
        }

        res.status(OKEY_STATUS_CODE).end();
    });
}

export function createTestAdmin (req, res) {
    const testAdmin = {
        login: 'admin',
        password: md5('admin')
    };

    addAdmin(testAdmin)
        .then(() => {
            res.status(OKEY_STATUS_CODE).end();
        })
        .catch(() => {
            res.status(FORBIDDEN_STATUS_CODE).end();
        });
}
