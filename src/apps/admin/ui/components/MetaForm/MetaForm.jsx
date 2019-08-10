import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import trim from '@tinkoff/utils/string/trim';
import remove from '@tinkoff/utils/array/remove';
import updateSeo from '../../../services/updateSeo';
import getAllSeo from '../../../services/getAllSeo';
import { connect } from 'react-redux';
import find from '@tinkoff/utils/array/find';
import compose from '@tinkoff/utils/function/compose';
import keys from '@tinkoff/utils/object/keys';
import pickBy from '@tinkoff/utils/object/pickBy';
import editProduct from '../../../services/editProduct';
import pick from '@tinkoff/utils/object/pick';
import prop from '@tinkoff/utils/object/prop';
import search from '../../../services/search';
import editCategory from '../../../services/editCategory';

const materialStyles = () => ({
    metaContainer: {
        width: '100%'
    },
    metaForm: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    metaAdd: {
        marginLeft: '12px',
        marginTop: '8px'
    },
    metaAddKeywords: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    metaKeyword: {
        margin: '4px',
        marginBottom: '20px'
    }
});
const PRODUCTS_VALUES = ['name', 'company', 'price', 'discountPrice', 'categoryId', 'hidden', 'notAvailable', 'description', 'features', 'filters',
    'metaTitle', 'metaDescription', 'keywords'];
const mapStateToProps = ({ seo }) => {
    return {
        allSeo: seo.allSeo
    };
};
const mapDispatchToProps = (dispatch) => ({
    updateSeo: payload => dispatch(updateSeo(payload)),
    getAllSeo: payload => dispatch(getAllSeo(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    search: payload => dispatch(search(payload)),
    editCategory: payload => dispatch(editCategory(payload))
});

class MetaForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        updateSeo: PropTypes.func.isRequired,
        getAllSeo: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        page: PropTypes.string.isRequired,
        product: PropTypes.object,
        searchQuery: PropTypes.string.isRequired,
        search: PropTypes.func,
        option: PropTypes.string.isRequired,
        editCategory: PropTypes.func.isRequired,
        category: PropTypes.object
    };

    static defaultProps = {
        allSeo: [],
        product: {},
        category: {},
        searchQuery: ''
    };

    constructor (...args) {
        super(...args);

        const { page, product, category, option } = this.props;
        const newProduct = {
            ...pick(PRODUCTS_VALUES, product)
        };

        this.state = {
            seo: option !== 'seo' ? {} : this.getSeoData(),
            keywordsInput: '',
            page: page,
            product: newProduct,
            id: prop('id', product),
            category: category,
            categoryId: category.id
        };
    }

    getSeoData = (props = this.props) => {
        const { page, allSeo } = props;
        const seoPage = find(seoPage => seoPage.name === page, allSeo);
        const newSeo = {
            name: page,
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        };
        return seoPage || newSeo;
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.product !== nextProps.product) {
            const newProduct = {
                ...pick(PRODUCTS_VALUES, nextProps.product)
            };

            this.setState({
                id: prop('id', nextProps.product),
                product: newProduct,
                keywordsInput: ''
            });
        }
    }

    handleKeywordChange = (option) => () => event => {
        this.setState({
            keywordsInput: event.target.value,
            [option]: {
                ...this.state[option],
                keywords: this.state[option].keywords === undefined ? '' : this.state[option].keywords
            }
        });
    };

    handleKeywordAdd = (option) => () => {
        const { keywordsInput } = this.state;
        const keyword = trim(keywordsInput);

        if (!keyword) {
            return;
        }

        const keywordsArray = this.state[option].keywords !== '' ? this.state[option].keywords.split(', ') : [];
        const newKeywords = [...keywordsArray, keyword];

        this.setState({
            [option]: {
                ...this.state[option],
                keywords: newKeywords.join(', ')
            },
            keywordsInput: ''
        });
    };

    handleKeywordDelete = (option, i) => () => {
        const keywordsArray = this.state[option].keywords.split(', ');
        const newKeywords = remove(i, 1, keywordsArray);

        this.setState({
            [option]: {
                ...this.state[option],
                keywords: newKeywords.join(', ')
            }
        });
    };

    getSeoPayload = (
        {
            name,
            metaTitle,
            metaDescription,
            keywords
        }) => {
        return {
            name,
            metaTitle,
            metaDescription,
            keywords
        };
    };

    getProductPayload = (
        {
            name,
            company,
            price,
            discountPrice,
            description,
            tagsMap,
            features,
            categoryId,
            filters,
            hidden,
            notAvailable,
            id,
            metaTitle,
            metaDescription,
            keywords
        }) => {
        const tags = compose(
            keys,
            pickBy(Boolean)
        )(tagsMap);

        return {
            name,
            company,
            price: +price,
            discountPrice: discountPrice && +discountPrice,
            description,
            features,
            categoryId,
            filters,
            tags,
            notAvailable,
            hidden,
            id,
            metaTitle,
            metaDescription,
            keywords
        };
    };

    handleChange = (prop, option) => event => {
        this.setState({
            [option]: {
                ...this.state[option],
                [prop]: event.target.value
            }
        });
    };

    searchProducts = searchText => {
        this.props.search(searchText);
    };

    handleSubmit = event => {
        event.preventDefault();

        const { seo, id, product, category, categoryId } = this.state;
        const { option } = this.props;
        if (option === 'seo') {
            const seoPayload = this.getSeoPayload(seo);

            this.props.updateSeo(seoPayload).then(this.props.getAllSeo());
        } else if (option === 'product') {
            const productPayload = this.getProductPayload(product);

            this.props.editProduct({ ...productPayload, id }).then(this.searchProducts(this.props.searchQuery));
        } else if (option === 'category') {
            this.props.editCategory({ ...category, categoryId });
        }
    };

    render () {
        const { classes, option } = this.props;
        const { keywordsInput } = this.state;

        return <div className={classes.metaContainer}>
            <form onSubmit={this.handleSubmit}>
                <div className={classes.metaForm}>
                    <TextField
                        label='Title'
                        value={this.state[option].metaTitle}
                        margin='normal'
                        variant='outlined'
                        fullWidth
                        required
                        onChange={this.handleChange('metaTitle', option)}
                    />
                </div>
                <div className={classes.metaForm}>
                    <TextField
                        label='Description'
                        value={this.state[option].metaDescription}
                        margin='normal'
                        variant='outlined'
                        fullWidth
                        required
                        onChange={this.handleChange('metaDescription', option)}
                    />
                </div>
                <div className={classes.metaAddKeywords}>
                    <TextField
                        label='Новое ключевое слово'
                        value={keywordsInput}
                        margin='normal'
                        variant='outlined'
                        fullWidth
                        onChange={this.handleKeywordChange(option)()}
                    />
                    <div className={classes.metaAdd}>
                        <Tooltip title='Добавить ключевое слово' placement='bottom'>
                            <Fab size='small' color='primary' aria-label="Add" onClick={this.handleKeywordAdd(option)}>
                                <AddIcon/>
                            </Fab>
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.keywordsWrapper}>
                    {
                        this.state[option].keywords &&
                        this.state[option].keywords.split(', ').map((chip, i) => <Chip
                            key={i}
                            label={chip}
                            variant='outlined'
                            color='primary'
                            className={classes.metaKeyword}
                            onDelete={this.handleKeywordDelete(option, i)}
                        />)
                    }
                </div>
                <FormControl margin='normal'>
                    <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                    </Button>
                </FormControl>
            </form>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(MetaForm));
