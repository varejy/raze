import express from 'express';
import React from 'react';
import path from 'path';
import fs from 'fs';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import { redirectToHTTPS } from 'express-http-to-https';
import { renderToString } from 'react-dom/server';

import map from '@tinkoff/utils/array/map';

import verification from './helpers/verification';

import adminAuthenticationApi from './api/admin/authentication';
import adminCategoryApi from './api/admin/category';
import adminProductApi from './api/admin/product';
import adminCommentApi from './api/admin/comment';
import adminMainSliderApi from './api/admin/mainSlider';
import adminOrderApi from './api/admin/order';
import adminSeoApi from './api/admin/seo';
import clientCategoryApi from './api/client/category';
import clientProductApi from './api/client/product';
import clientCommentApi from './api/client/comment';
import clientMainSliderApi from './api/client/mainSlider';
import clientSavedProductsApi from './api/client/savedProducts';
import clientOrderApi from './api/client/order';
import clientSeoApi from './api/client/seo';

import { DATABASE_URL } from './constants/constants';
import actions from './actions';
import getStore from '../src/apps/client/store/getStore';
import renderAppPage from '../src/apps/client/html';
import renderAdminPage from '../src/apps/admin/html';

import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import App from '../src/apps/client/App.jsx';

const credentials = {
    key: fs.readFileSync('server/https/private.key'),
    cert: fs.readFileSync('server/https/raze_com_ua.crt'),
    ca: [
        fs.readFileSync('server/https/AddTrust_External_CA_Root.crt'),
        fs.readFileSync('server/https/USERTrust_RSA_Certification_Authority.crt')
    ]
};
const ignoreHttpsHosts = [/localhost:(\d{4})/];

const rootPath = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = 443;
const app = express();

// mongodb
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

// verification
app.use(verification);

// redirects
app.use(redirectToHTTPS(ignoreHttpsHosts, [], 301));

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
app.use('/api/admin/comment', adminCommentApi);
app.use('/api/admin/main-slider', adminMainSliderApi);
app.use('/api/admin/order', adminOrderApi);
app.use('/api/admin/seo', adminSeoApi);
app.use('/api/client/category', clientCategoryApi);
app.use('/api/client/product', clientProductApi);
app.use('/api/client/comment', clientCommentApi);
app.use('/api/client/main-slider', clientMainSliderApi);
app.use('/api/client/saved-products', clientSavedProductsApi);
app.use('/api/client/order', clientOrderApi);
app.use('/api/client/seo', clientSeoApi);

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
            return actionFunc(req, res)(store.dispatch);
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

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(HTTPS_PORT);
