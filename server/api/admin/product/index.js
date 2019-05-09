import express from 'express';

import verification from '../../../middlewares/verification';

import { getProducts, saveProduct, editProduct, deleteByIds, updateFiles, findProductsByName } from './service';

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

router.route('/update-files')
    .post(updateFiles);

router.route('/find')
    .get(findProductsByName);

export default router;
