'use strict';

import express from 'express';

import { authenticate, checkAuthentication, createTestAdmin } from './service';

const router = express.Router();

router.route('/authenticate')
    .post(authenticate);

router.route('/check')
    .get(checkAuthentication);

router.route('/create-test-admin')
    .get(createTestAdmin);

export default router;
