import getMobileDetect from '../src/apps/client/services/server/getMobileDetect';
import getCategories from '../src/apps/client/services/server/getCategories';
import getProductsByCategory from '../src/apps/client/services/server/getProductsByCategory';
import getProductById from '../src/apps/client/services/server/getProductById';
import getMainSlides from '../src/apps/client/services/server/getMainSlides';

export default [
    getMobileDetect,
    getCategories,
    getProductsByCategory,
    getProductById,
    getMainSlides
];
