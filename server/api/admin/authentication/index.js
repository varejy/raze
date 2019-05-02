import express from 'express';

import { authenticate, checkAuthentication, changeCredentials, createTestAdmin } from './service';

const router = express.Router();

router.route('/authenticate')
    .post(authenticate);

router.route('/check')
    .get(checkAuthentication);

router.route('/change')
    .post(changeCredentials);

router.route('/create-test-admin')
    .get(createTestAdmin);

export default router;
