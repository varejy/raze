import express from 'express';

import verification from '../../../middlewares/verification';

import { getProducts, saveProduct, editProduct, deleteByIds } from './service';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getProducts);

router.route('/save')
    .post(saveProduct);

router.route('/edit')
    .post(editProduct);

router.route('/delete-few')
    .post(deleteByIds);

export default router;
