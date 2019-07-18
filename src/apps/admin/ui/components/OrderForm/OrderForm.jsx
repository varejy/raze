import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import editOrder from '../../../services/editOrder';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import propEq from '@tinkoff/utils/object/propEq';
import find from '@tinkoff/utils/array/find';
import format from 'date-fns/format';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    editOrder: payload => dispatch(editOrder(payload))
});

const materialStyles = theme => ({
    loader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    table: {
        marginBottom: '25px',
        marginTop: '15px'
    },
    title: {
        marginBottom: '12px'
    },
    statusField: {
        width: '100%',
        height: '56px',
        backgroundColor: '#ffffff',
        marginTop: '12px',
        marginBottom: '12px'
    },
    typographyTitle: {
        margin: '12px'
    },
    textField: {
        width: '100%'
    },
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    }
});

class OrderForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        order: PropTypes.object.isRequired,
        editOrder: PropTypes.func,
        orderTypes: PropTypes.array,
        paymentTypes: PropTypes.array,
        onDone: PropTypes.func
    };

    static defaultProps = {
        onDone: noop,
        product: {}
    };

    constructor (props) {
        super(props);

        this.state = {
            order: this.props.order,
            id: prop('id', this.props.order)
        };
    }

    formatOrderDate = order => format(order.date, 'hh:mm:ss - DD MMM YYYY');

    componentDidMount () {
        this.props.order && this.setState({
            loading: false
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const { id } = this.state;

        this.props.editOrder({ ...this.state.order, id })
            .then(this.props.onDone);
    };

    handleOrderChange = prop => event => {
        const { order } = this.state;

        order[prop] = event.target.value;

        this.setState({
            order
        });
    };

    render () {
        const { classes, orderTypes, paymentTypes } = this.props;
        const { order } = this.state;
        const formatOrderDate = this.formatOrderDate(order);

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5' className={classes.title}>Редактирование заказа</Typography>
            <Paper className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={4}>Название</TableCell>
                            <TableCell align="center">Значение</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4}>Имя заказчика</TableCell>
                            <TableCell align="center">{order.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>Город</TableCell>
                            <TableCell align="center">{order.city}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>Тип доставки</TableCell>
                            <TableCell align="center">{
                                find(propEq('id', order.orderType))(orderTypes).value
                            }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>Тип оплаты</TableCell>
                            <TableCell align="center">{
                                find(propEq('id', order.paymentType))(paymentTypes).value
                            }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>Отделение</TableCell>
                            <TableCell align="center">{order.department}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>Дата реестрации</TableCell>
                            <TableCell align="center">{formatOrderDate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>Номер телефона</TableCell>
                            <TableCell align="center">{order.phone}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant='h6'>Товары</Typography>
            <Paper>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={1}>Название</TableCell>
                            <TableCell colSpan={3} align="center">Количество</TableCell>
                            <TableCell colSpan={1} align="right">Цена</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            order.products.map((product, i) => {
                                return <TableRow key={i}>
                                    <TableCell colSpan={1}>{product.name}</TableCell>
                                    <TableCell colSpan={3} align="center">{product.count}</TableCell>
                                    <TableCell colSpan={1} align="right">{product.price}</TableCell>
                                </TableRow>;
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant='h6'>Статус заказа</Typography>
            <FormGroup>
                <FormControl variant="outlined" required className={classes.statusField}>
                    <InputLabel>
                        Статус
                    </InputLabel>
                    <Select
                        value={order.status}
                        onChange={this.handleOrderChange('status')}
                        input={<OutlinedInput value={order.status} labelWidth={58} name="Status" />}
                    >
                        <MenuItem value='new'>New</MenuItem>
                        {order.paymentType === 'card' && <MenuItem value='paid'>Paid</MenuItem>}
                        <MenuItem value='sent'>Sent</MenuItem>
                        <MenuItem value='done'>Done</MenuItem>
                        <MenuItem value='declined'>Declined</MenuItem>
                    </Select>
                </FormControl>
            </FormGroup>
            <Typography variant='h6'>Комментарий</Typography>
            <TextField
                label="Комментарий"
                multiline
                rows="3"
                defaultValue={order.comment}
                onChange={this.handleOrderChange('comment')}
                className={classes.textField}
                margin="normal"
                variant="outlined"
            />
            <Divider className={classes.divider} />
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(OrderForm));
