import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllProducts from '../../../client/product/queries/getAllProducts';
// import editProduct from '../../../client/product/queries/editProduct';
// import checkingRemainingTime from '../utils/checkingRemainingTime';

export default function getProducts (req, res) {
    getAllProducts()
        .then(products => {
            // const checkingProductsDiscountTime = products.map(product => {
            //     if (!product.discountTime) {
            //         return product;
            //     } else {
            //         if (checkingRemainingTime(product.discountTime).length) {
            //             return product;
            //         } else {
            //             const id = product.id;
            //             product.discountPrice = '';
            //             console.log(...product)
            //             //editProduct({ ...product, id });
            //             return product;
            //         }
            //     }
            // });

            res.status(OKEY_STATUS_CODE).send(products);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
