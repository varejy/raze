import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { connect } from 'react-redux';
import getCategories from '../../../services/getCategories';
import saveProduct from '../../../services/saveProduct';
import editProduct from '../../../services/editProduct';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';

import styles from './ProductForm.css';

const PRODUCTS_VALUES = ['name', 'price', 'categoryId', 'hidden'];

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload)),
    saveProduct: payload => dispatch(saveProduct(payload)),
    editProduct: payload => dispatch(editProduct(payload))
});

class ProductForm extends Component {
    static propTypes = {
        getCategories: PropTypes.func.isRequired,
        saveProduct: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        product: PropTypes.object,
        categories: PropTypes.array
    };

    static defaultProps = {
        onDone: noop,
        product: {},
        categories: []
    };

    constructor (...args) {
        super(...args);

        const { product, categories } = this.props;

        this.state = {
            product: {
                hidden: false,
                ...pick(PRODUCTS_VALUES, product)
            },
            id: prop('id', product),
            loading: true,
            categoriesOptions: categories.map(category => ({
                label: category.name,
                value: category.id
            }))
        };
    }

    componentDidMount () {
        this.props.getCategories()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.categories.length !== this.props.categories.length) {
            this.setState({
                categoriesOptions: nextProps.categories.map(category => ({
                    label: category.name,
                    value: category.id
                }))
            });
        }
    }

    handleSubmit = event => {
        event.preventDefault();

        const { id, product } = this.state;

        (id ? this.props.editProduct({ ...product, id }) : this.props.saveProduct(product))
            .then(() => {
                this.props.onDone();
            });
    };

    handleChange = prop => event => {
        this.setState({
            product: {
                ...this.state.product,
                [prop]: event.target.value
            }
        });
    };

    handleCheckboxChange = prop => (event, value) => {
        this.setState({
            product: {
                ...this.state.product,
                [prop]: value
            }
        });
    };

    render () {
        const { product, loading, categoriesOptions, id } = this.state;

        if (loading) {
            return <div className={styles.loader}>
                <CircularProgress />
            </div>;
        }

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>{id ? 'Редактирование товара' : 'Добавление нового товара'}</Typography>
            <TextField
                label='Название'
                value={product.name}
                onChange={this.handleChange('name')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
            <TextField
                select
                label='Категория'
                value={product.categoryId}
                onChange={this.handleChange('categoryId')}
                margin='normal'
                variant='outlined'
                fullWidth
                InputLabelProps={{
                    shrink: !!product.categoryId
                }}
                required
            >
                {categoriesOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label='Цена'
                value={product.price}
                onChange={this.handleChange('price')}
                InputProps={{ inputProps: { min: 0 } }}
                margin='normal'
                variant='outlined'
                type='number'
                fullWidth
                required
            />
            <div>
                <FormControlLabel
                    control ={
                        <Checkbox
                            checked={product.hidden}
                            onChange={this.handleCheckboxChange('hidden')}
                            color='primary'
                        />
                    }
                    label='Скрыть товар'
                />
            </div>
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);
