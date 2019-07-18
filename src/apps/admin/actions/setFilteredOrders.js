import { SET_FILTERED_ORDERS } from '../types/types';

const setFilteredOrders = payload => ({
    type: SET_FILTERED_ORDERS,
    payload
});

export default setFilteredOrders;
