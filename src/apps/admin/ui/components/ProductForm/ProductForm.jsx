import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import ProductFormFiles from '../ProductFormFiles/ProductFormFiles.jsx';

import { connect } from 'react-redux';
import getProducts from '../../../services/getProducts';
import getCategories from '../../../services/getCategories';
import saveProduct from '../../../services/saveProduct';
import editProduct from '../../../services/editProduct';
import updateProductFiles from '../../../services/updateProductFiles';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import find from '@tinkoff/utils/array/find';
import remove from '@tinkoff/utils/array/remove';

import Tooltip from '@material-ui/core/Tooltip';

const PRODUCTS_VALUES = ['name', 'price', 'categoryId', 'hidden', 'description', 'features'];

const materialStyles = theme => ({
    loader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    features: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '210px'
    },
    feature: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    featureGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    featureField: {
        width: 'calc(50% - 10px)'
    },
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    }
});

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload)),
    saveProduct: payload => dispatch(saveProduct(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    getProducts: payload => dispatch(getProducts(payload)),
    updateProductFiles: (...payload) => dispatch(updateProductFiles(...payload))
});

class ProductForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getProducts: PropTypes.func.isRequired,
        getCategories: PropTypes.func.isRequired,
        saveProduct: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        updateProductFiles: PropTypes.func.isRequired,
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
            features: [],
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
            })),
            initialFiles: product.files,
            removedFiles: []
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
            .then(product => {
                const { files, removedFiles } = this.state;
                const formData = new FormData();
                const oldFiles = [];

                files.forEach((file, i) => {
                    if (file.content) {
                        formData.append(`product-${product.id}-file-${i}`, file.content);
                    } else {
                        oldFiles.push({
                            path: file.path,
                            index: i
                        });
                    }
                });
                formData.append('removedFiles', JSON.stringify(removedFiles));
                formData.append('oldFiles', JSON.stringify(oldFiles));

                return this.props.updateProductFiles(formData, product.id);
            })
            .then(() => {
                return this.props.getProducts();
            })
            .then(() => {
                this.props.onDone();
            });
    };

    handleFeatureAdd = () => {
        const { product } = this.state;

        this.setState({
            product: {
                ...product,
                features: [
                    ...product.features,
                    { prop: '', value: '' }
                ]
            }
        });
    };

    handleFeatureChange = (prop, i) => event => {
        const { product } = this.state;
        const features = product.features;

        features[i][prop] = event.target.value;

        this.setState({
            product: {
                ...product,
                features: features
            }
        });
    };

    handleFeatureDelete = i => () => {
        const { product } = this.state;

        this.setState({
            product: {
                ...product,
                features: remove(i, 1, product.features)
            }
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
            this.prevProductHidden = value;
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

    handleFilesUpload = (files, removedFiles) => {
        this.setState({
            files,
            removedFiles
        });
    };

    render () {
        const { classes } = this.props;
        const { product, loading, categoriesOptions, id, hiddenCheckboxIsDisables, initialFiles } = this.state;

        if (loading) {
            return <div className={classes.loader}>
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
            <TextField
                label='Описание'
                value={product.description}
                onChange={this.handleChange('description')}
                margin='normal'
                variant='outlined'
                multiline
                fullWidth
                required
            />
            <div className={classes.features}>
                <Typography variant='h6'>Характеристики</Typography>
                <Fab color='primary' size='small' onClick={this.handleFeatureAdd}>
                    <AddIcon />
                </Fab>
            </div>
            <div>
                {
                    product.features.map((feature, i) => <FormGroup key={i} className={classes.feature} row>
                        <div className={classes.featureGroup}>
                            <TextField
                                className={classes.featureField}
                                label='Свойство'
                                value={feature.prop}
                                onChange={this.handleFeatureChange('prop', i)}
                                margin='normal'
                                variant='outlined'
                                required
                            />
                            <TextField
                                className={classes.featureField}
                                label='Значение'
                                value={feature.value}
                                onChange={this.handleFeatureChange('value', i)}
                                margin='normal'
                                variant='outlined'
                                required
                            />
                        </div>
                        <IconButton aria-label='Delete' onClick={this.handleFeatureDelete(i)}>
                            <DeleteIcon />
                        </IconButton>
                    </FormGroup>)
                }
            </div>
            <Divider className={classes.divider}/>
            <ProductFormFiles onFilesUpload={this.handleFilesUpload} initialFiles={initialFiles}/>
            <Divider className={classes.divider}/>
            <div>
                <Tooltip
                    title={hiddenCheckboxIsDisables ? 'Товар будет скрыт, т.к. выбранная категория скрыта' : ''}
                    placement='right'
                >
                    <FormControlLabel
                        control={
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ProductForm));
