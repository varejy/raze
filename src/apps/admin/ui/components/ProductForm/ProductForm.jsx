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
import find from '@tinkoff/utils/array/find';

import styles from './ProductForm.css';
import Tooltip from '@material-ui/core/Tooltip';

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
        const category = find(category => category.id === product.categoryId, categories);
        const newProduct = {
            hidden: false,
            ...pick(PRODUCTS_VALUES, product)
        };

        this.prevProductHidden = newProduct.hidden;

        this.state = {
            product: newProduct,
            hiddenCheckboxIsDisables: category && category.hidden,
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
        if (prop === 'categoryId') {
            this.handleCategoryIdChange(event);
        }

        this.setState({
            product: {
                ...this.state.product,
                [prop]: event.target.value
            }
        });
    };

    handleCheckboxChange = prop => (event, value) => {
        if (prop === 'hidden') {
            this.prevProductHidden = value
        }

        this.setState({
            product: {
                ...this.state.product,
                [prop]: value
            }
        });
    };

    handleCategoryIdChange = (event) => {
        const { categories } = this.props;
        const categoryId = event.target.value;
        const category = find(category => category.id === categoryId, categories);

        this.setState({
            hiddenCheckboxIsDisables: category.hidden
        }, () => this.setState({
            product: {
                ...this.state.product,
                hidden: category.hidden ? category.hidden : this.prevProductHidden
            }
        }));
    };

    render () {
        const { product, loading, categoriesOptions, id, hiddenCheckboxIsDisables } = this.state;

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
                <Tooltip
                    title={hiddenCheckboxIsDisables ? 'Товар будет скрыт, т.к. выбранная категория скрыта' : ''}
                    placement='right'
                >
                    <FormControlLabel
                        control ={
                            <Checkbox
                                checked={product.hidden}
                                onChange={this.handleCheckboxChange('hidden')}
                                color='primary'
                            />
                        }
                        label='Скрыть товар'
                        disabled={hiddenCheckboxIsDisables}
                    />
                </Tooltip>
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
