import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { FORBIDDEN_STATUS_CODE } from '../constants/constants';

const publicKey = fs.readFileSync(path.resolve(__dirname, 'privateKeys/adminPublicKey.ppk'), 'utf8');

export default function verification (req, res, next) {
    const { token } = req.query;

    if (token) {
        jsonwebtoken.verify(token, publicKey, {
            algorithm: 'RS256'
        }, err => {
            if (err) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }
            next();
        });
    } else {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }
}
