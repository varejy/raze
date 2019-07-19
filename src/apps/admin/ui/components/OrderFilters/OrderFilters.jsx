import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import propOr from '@tinkoff/utils/object/propOr';
import compose from '@tinkoff/utils/function/compose';
import reduceObj from '@tinkoff/utils/object/reduce';
import includes from '@tinkoff/utils/array/includes';
import keys from '@tinkoff/utils/object/keys';
import pickBy from '@tinkoff/utils/object/pickBy';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import setFilteredOrders from '../../../actions/setFilteredOrders';

const PAYMENT_TYPES = [
    {
        id: 'card',
        value: 'На карту банка'
    },
    {
        id: 'cod',
        value: 'Наложенным платежом'
    }
];

const STATUS_TYPES = ['new', 'paid', 'sent', 'done', 'declined'];

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
            selectedPaymentTypes: PAYMENT_TYPES.reduce((result, type) => ({ ...result, [type.id]: true }), {}),
            selectedStatuses: STATUS_TYPES.reduce((result, type) => ({ ...result, [type]: true }), {}),
            filters: {}
        };
    }

    setFilteredOrders = (props = this.props) => {
        const { orders } = props;
        const { filters } = this.state;

        const filteredOrders = reduceObj((filteredOrders, order) => {
            return filteredOrders.filter(order);
        }, orders, filters);

        this.props.setFilteredOrders(filteredOrders);
    };

    handleFiltersChanged = () => {
        this.setFilteredOrders();
    };

    handleChecked = (value, prop) => () => {
        const { filters } = this.state;
        const selectedNamesMap = {
            paymentType: 'selectedPaymentTypes',
            status: 'selectedStatuses'
        }
        const selected = this.state[selectedNamesMap[prop]];
        const nextSelectedStatus = {
            ...selected,
            [value]: !selected[value]
        };
        const activeProps = compose(
            keys,
            pickBy(Boolean)
        )(nextSelectedStatus);
        const newFilters = {
            ...filters,
            [prop]: order => {
                return includes(order[prop], activeProps);
            }
        };

        this.setState({
            [selectedNamesMap[prop]]: nextSelectedStatus,
            filters: newFilters
        }, this.handleFiltersChanged);
    };

    renderStatus = () => {
        const { classes } = this.props;
        const { selectedStatuses } = this.state;

        return <div>
            <Typography variant='h6'>Статусы</Typography>
            <List dense>
                {
                    STATUS_TYPES.map((status, i) => {
                        const value = propOr([status], false, selectedStatuses);

                        return <ListItem key={i}>
                            <FormControlLabel
                                margin='dense'
                                control={
                                    <Checkbox
                                        value={status}
                                        onChange={this.handleChecked(status, 'status')}
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
        const { selectedPaymentTypes } = this.state;

        return <div>
            <Typography variant='h6'>Тип оплаты</Typography>
            <List dense>
                { PAYMENT_TYPES.map((type, i) => {
                    const value = propOr([type.id], false, selectedPaymentTypes);

                    return <ListItem key={i}>
                        <FormControlLabel
                            margin='dense'
                            control={
                                <Checkbox
                                    value={type.id}
                                    color='primary'
                                    onChange={this.handleChecked(type.id, 'paymentType')}
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
