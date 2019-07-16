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
import filterUtil from '@tinkoff/utils/array/filter';
import includes from '@tinkoff/utils/array/includes';
import keys from '@tinkoff/utils/object/keys';
import pickBy from '@tinkoff/utils/object/pickBy';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import setFilteredOrders from '../../../actions/setFilteredOrders';

const PAYMENT_TYPES_ARR = [
    {
        id: 'card',
        value: 'На карту банка'
    },
    {
        id: 'cod',
        value: 'Наложенным платежом'
    }
];

const STATUS_TYPES_ARR = ['new', 'paid', 'sent', 'done', 'declined'];

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
            selectedPaymentTypes: this.defaulOptions('paymentType'),
            selectedStatus: this.defaulOptions('status'),
            paymentTypes: PAYMENT_TYPES_ARR,
            statusArr: STATUS_TYPES_ARR
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

    defaulOptions = (type) => {
        if (type === 'paymentType') {
            let types = {
                id: 1,
                prop: 'paymentType'
            };

            PAYMENT_TYPES_ARR.map(type => {
                types = {
                    ...types,
                    [type.id]: true
                };
            });
            return types;
        } else if (type === 'status') {
            let types = {
                id: 2,
                prop: 'status'
            };

            STATUS_TYPES_ARR.map(type => {
                types = {
                    ...types,
                    [type]: true
                };
            });
            return types;
        }
    }

    handleChecked = (prop, event) => () => {
        const { selectedStatus, selectedPaymentTypes } = this.state;

        if (event === 'status') {
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
        } else if (event === 'paymentType') {
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
        }
    };

    renderStatus = () => {
        const { classes } = this.props;
        const { statusArr, selectedStatus } = this.state;

        return <div>
            <Typography variant='h6'>Статусы</Typography>
            <List dense>
                {
                    statusArr.map((status, i) => {
                        const value = propOr([status], false, selectedStatus);

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
