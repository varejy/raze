import md5 from 'md5';

import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE } from '../../../../constants/constants';

import addAdmin from '../queries/addAdmin';

export default function createTestAdmin (req, res) {
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
