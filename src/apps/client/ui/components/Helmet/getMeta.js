import find from '@tinkoff/utils/array/find';
import { matchPath } from 'react-router';

const ROUTES = [
    { id: 'mainPage', path: '/', exact: true },
    { id: 'searchPage', path: '/search', exact: true },
    { id: 'orderPage', path: '/order', exact: true },
    { id: 'productsPage', path: '/:category', exact: true },
    { id: 'productPage', path: '/:category/:id', exact: true }
];

const META_DATA = {
    mainPage: { title: 'main', description: 'main' },
    searchPage: { title: 'search', description: 'search' },
    orderPage: { title: 'order', description: 'order' },
    productsPage: { title: 'products', description: 'products' },
    productPage: { title: 'product', description: 'product' }
};

export default function (pathname) {
    const match = find(route => matchPath(pathname, route), ROUTES);

    return META_DATA[match.id];
};
