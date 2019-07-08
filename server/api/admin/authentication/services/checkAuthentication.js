import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import md5 from 'md5';
import uniqid from 'uniqid';

import getAnyAdmin from '../queries/getAnyAdmin';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import addAdmin from '../queries/addAdmin';

const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

export default function checkAuthentication (req, res) {
    const token = req.query.token;

    getAnyAdmin()
        .then(admin => {
            if (!admin) {
                const testAdmin = {
                    login: 'admin',
                    password: md5('admin'),
                    email: 'dev.occam@gmail.com',
                    id: uniqid()
                };

                return addAdmin(testAdmin)
                    .then(() => {
                        res.status(FORBIDDEN_STATUS_CODE).end();
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            }

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
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
