import express from 'express';

import getSeoData from './services/getAllSeo';

const router = express.Router();

router.route('/')
    .get(getSeoData);

export default router;
