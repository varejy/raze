import find from '@tinkoff/utils/array/find';
import { matchPath } from 'react-router';

const ROUTES = [
    { id: 'mainPage', path: '/', exact: true, title: 'main', description: 'main' },
    { id: 'searchPage', path: '/search', exact: true, title: 'search', description: 'search' },
    { id: 'orderPage', path: '/order', exact: true, title: 'order', description: 'order' },
    { id: 'productsPage', path: '/:category', exact: true, title: 'products', description: 'products' },
    { id: 'productPage', path: '/:category/:id', exact: true, title: 'product', description: 'product' }
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
