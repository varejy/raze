import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import type from '@tinkoff/utils/type';
import propOr from '@tinkoff/utils/object/propOr';
import flatten from '@tinkoff/utils/array/flatten';
import compose from '@tinkoff/utils/function/compose';
import reduceObj from '@tinkoff/utils/object/reduce';
import filterUtil from '@tinkoff/utils/array/filter';
import includes from '@tinkoff/utils/array/includes';
import keys from '@tinkoff/utils/object/keys';
import pickBy from '@tinkoff/utils/object/pickBy';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import setFilteredOrders from '../../../actions/setFilteredOrders';

const materialStyles = {
    checkbox: {
        paddingTop: '0',
        paddingBottom: '0'
    }
};

const mapStateToProps = ({ orders }) => {
    return {
        orders: orders.orders
    };
};

const mapDispatchToProps = (dispatch) => ({
    setFilteredOrders: payload => dispatch(setFilteredOrders(payload))
});

class OrderFilters extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        setFilteredOrders: PropTypes.func,
        paymentTypes: PropTypes.array,
        orders: PropTypes.array
    };

    static defaultProps = {
        categories: [],
        products: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            selectedPaymentTypes: {
                id: 1,
                prop: 'paymentType'
            },
            selectedStatus: {
                id: 2,
                prop: 'status'
            },
            paymentTypes: this.getPaymentType(),
            status: this.getStatus()
        };

        this.filtersMap = {};
    }

    filter = () => {
        const { orders, setFilteredOrders } = this.props;

        let newFilteredOrders = reduceObj((filteredOrders, { filter, values }) => {
            return !values.length ? filteredOrders : filterUtil(order => includes(order[filter.prop], values), filteredOrders);
        }, orders, this.filtersMap);

        setFilteredOrders(newFilteredOrders);
    }

    handleFilter = filter => values => {
        this.filtersMap[filter.id] = {
            filter,
            values
        };

        this.filter();
    };

    handleStatusChecked = prop => () => {
        const { selectedStatus } = this.state;

        const nextSelectedStatus = {
            ...selectedStatus,
            [prop]: !selectedStatus[prop]
        };

        const activeProps = compose(
            filterUtil(values => values !== 'id' || values !== 'prop'),
            keys,
            pickBy(Boolean)
        )(nextSelectedStatus);

        this.setState({
            selectedStatus: nextSelectedStatus
        });
        this.handleFilter(nextSelectedStatus)(activeProps);
    };

    handlePaymentChecked = prop => () => {
        const { selectedPaymentTypes } = this.state;

        const nextSelectedPaymentTypes = {
            ...selectedPaymentTypes,
            [prop]: !selectedPaymentTypes[prop]
        };

        const activeProps = compose(
            filterUtil(values => values !== 'id' || values !== 'prop'),
            keys,
            pickBy(Boolean)
        )(nextSelectedPaymentTypes);

        this.setState({
            selectedPaymentTypes: nextSelectedPaymentTypes
        });
        this.handleFilter(nextSelectedPaymentTypes)(activeProps);
    };

    getStatus = () => {
        const { orders } = this.props;

        return compose(
            uniq,
            map((order, i) => {
                return order.status;
            })
        )(orders);
    }

    getPaymentType = () => {
        const { orders, paymentTypes } = this.props;
        const isObject = elem => type(elem) !== 'Boolean';
        return compose(
            elem => filterUtil(isObject, elem),
            flatten,
            map((paymentType, i) => {
                return map(type => paymentType === type.id && type, paymentTypes);
            }),
            uniq,
            map((order, i) => {
                return order.paymentType;
            })
        )(orders);
    }

    renderStatus = () => {
        const { classes } = this.props;
        const { status, selectedStatus } = this.state;

        return <div>
            <Typography variant='h6'>Статусы</Typography>
            <List dense>
                {
                    status.map((status, i) => {
                        const value = propOr([status], false, selectedStatus);

                        return <ListItem key={i}>
                            <FormControlLabel
                                margin='dense'
                                control={
                                    <Checkbox
                                        value={status}
                                        onChange={this.handleStatusChecked(status)}
                                        checked={value}
                                        color='primary'
                                        className={classes.checkbox}
                                    />
                                }
                                label={status}
                            />
                        </ListItem>;
                    })
                }
            </List>
        </div>;
    };

    renderPaymentTypes = () => {
        const { classes } = this.props;
        const { paymentTypes, selectedPaymentTypes } = this.state;

        return <div>
            <Typography variant='h6'>Тип оплаты</Typography>
            <List dense>
                { paymentTypes.map((type, i) => {
                    const value = propOr([type.id], false, selectedPaymentTypes);

                    return <ListItem key={i}>
                        <FormControlLabel
                            margin='dense'
                            control={
                                <Checkbox
                                    value={type.id}
                                    color='primary'
                                    onChange={this.handlePaymentChecked(type.id)}
                                    checked={value}
                                    className={classes.checkbox}
                                />
                            }
                            label={type.value}
                        />
                    </ListItem>;
                }) }
            </List>
        </div>;
    }

    render () {
        return <div>
            <Typography variant='h5' gutterBottom>Фильтрация</Typography>
            {this.renderPaymentTypes()}
            {this.renderStatus()}
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(OrderFilters));
