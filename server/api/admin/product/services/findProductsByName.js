import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findProductsByNameQuery from '../../../client/product/queries/findProductsByName';
// import editProduct from '../../../client/product/queries/editProduct';
// import checkingRemainingTime from '../utils/checkingRemainingTime';

export default function findProductsByName (req, res) {
    const { text } = req.query;

    findProductsByNameQuery(text)
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
