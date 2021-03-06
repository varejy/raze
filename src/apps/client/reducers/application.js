import {
    SET_CATEGORIES,
    SET_PRODUCTS_TO_MAP,
    SET_MAIN_SLIDES,
    SET_MEDIA_INFO,
    SET_PRODUCT_TO_MAP,
    SET_TOP_PRODUCTS,
    SET_SEO
} from '../types/types';

const initialState = {
    media: {
        width: 0,
        height: 0
    },
    categories: [],
    productsMap: {},
    productMap: {},
    topProducts: [],
    mainSlides: [],
    staticSeo: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_MEDIA_INFO:
        return { ...state, media: action.payload };
    case SET_CATEGORIES:
        return { ...state, categories: action.payload };
    case SET_PRODUCTS_TO_MAP:
        return {
            ...state,
            productsMap: {
                ...state.productsMap,
                ...action.payload
            }
        };
    case SET_PRODUCT_TO_MAP:
        return {
            ...state,
            productMap: {
                ...state.productMap,
                ...action.payload
            }
        };
    case SET_TOP_PRODUCTS:
        return { ...state, topProducts: action.payload };
    case SET_MAIN_SLIDES:
        return { ...state, mainSlides: action.payload };
    case SET_SEO:
        return { ...state, staticSeo: action.payload };
    default:
        return state;
    }
}
