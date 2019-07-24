import find from '@tinkoff/utils/array/find';
import { matchPath } from 'react-router';

const ROUTES = [
    { id: 'main', path: '/', exact: true },
    { id: 'search', path: '/search', exact: true },
    { id: 'order', path: '/order', exact: true },
    { id: 'products', path: '/:category', exact: true },
    { id: 'product', path: '/:category/:id', exact: true }
];

export default function (pathname, META_DATA) {
    const match = find(route => matchPath(pathname, route), ROUTES);

    return META_DATA[match.id];
};
