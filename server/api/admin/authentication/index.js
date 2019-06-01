import express from 'express';

import verification from '../../../middlewares/verification';

import { authenticate, checkAuthentication, changeCredentials, createTestAdmin, recover, checkRecoveryToken, changeRecoveryCredentials } from './service';

const router = express.Router();

router.route('/authenticate')
    .post(authenticate);

router.route('/check')
    .get(checkAuthentication);

router.route('/recover')
    .get(recover);

router.route('/check-recovery-token')
    .get(checkRecoveryToken);

router.route('/recover-change')
    .post(changeRecoveryCredentials);

router.route('/create-test-admin')
    .get(createTestAdmin);

router.use(verification);

router.route('/change')
    .post(changeCredentials);

export default router;
