import getMobileDetect from '../src/apps/client/services/server/getMobileDetect';
import getCategories from '../src/apps/client/services/server/getCategories';
import getProductsByCategory from '../src/apps/client/services/server/getProductsByCategory';
import getProductById from '../src/apps/client/services/server/getProductById';
import getTopProducts from '../src/apps/client/services/server/getTopProducts';
import getMainSlides from '../src/apps/client/services/server/getMainSlides';
import getSavedProducts from '../src/apps/client/services/server/getSavedProducts';
import getSeo from '../src/apps/client/services/server/getSeo';

export default [
    getMobileDetect,
    getCategories,
    getProductsByCategory,
    getProductById,
    getTopProducts,
    getMainSlides,
    getSavedProducts,
    getSeo
];
