import express from 'express';
import React from 'react';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import { renderToString } from 'react-dom/server';

import map from '@tinkoff/utils/array/map';

import adminAuthenticationApi from './api/admin/authentication';
import adminCategoryApi from './api/admin/category';
import adminProductApi from './api/admin/product';
import adminMainSliderApi from './api/admin/mainSlider';

import { DATABASE_URL } from './constants/constants';
import actions from './actions';
import getStore from '../src/apps/app/store/getStore';
import renderAppPage from '../src/apps/app/html';
import renderAdminPage from '../src/apps/admin/html';

import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import App from '../src/apps/app/App.jsx';

const rootPath = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;
const app = express();

// mongodb
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

// static
app.get(/\.chunk\.(js|css)$/, expressStaticGzip(rootPath, {
    enableBrotli: true,
    orderPreference: ['br']
}));
app.use(compression());
app.use(express.static(rootPath));

// helpers
app.use(bodyParser.json());
app.use(cookieParser());

// api
app.use('/api/admin/authentication', adminAuthenticationApi);
app.use('/api/admin/category', adminCategoryApi);
app.use('/api/admin/product', adminProductApi);
app.use('/api/admin/main-slider', adminMainSliderApi);

// admin
app.get(/^\/admin/, function (req, res) {
    const page = renderAdminPage();

    res.send(page);
});

// app
app.get('*', function (req, res) {
    const store = getStore();

    Promise.all(map(
        actionFunc => {
            return actionFunc(req)(store.dispatch);
        },
        actions
    ))
        .then(() => {
            const context = {};
            const html = renderToString(
                <Provider store={store}>
                    <StaticRouter
                        location={req.originalUrl}
                        context={context}
                    >
                        <App />
                    </StaticRouter>
                </Provider>
            );
            const helmet = Helmet.renderStatic();
            const preloadedState = store.getState();
            const page = renderAppPage(html, helmet, preloadedState);

            res.send(page);
        });
});

app.listen(PORT, function () {
    console.log('listening on port', PORT); // eslint-disable-line no-console
});
