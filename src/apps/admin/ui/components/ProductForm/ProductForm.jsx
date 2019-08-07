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
import AutoRenew from '@material-ui/icons/AutorenewRounded';
import ReorderIcon from '@material-ui/icons/Reorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/FileCopy';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import ProductFormFiles from '../ProductFormFiles/ProductFormFiles.jsx';
import ProductAvatarFile from '../ProductAvatarFile/ProductAvatarFile.jsx';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import { connect } from 'react-redux';
import getCategories from '../../../services/getCategories';
import saveProduct from '../../../services/saveProduct';
import editProduct from '../../../services/editProduct';
import updateProductFiles from '../../../services/updateProductFiles';
import updateProductAvatar from '../../../services/updateProductAvatar';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import find from '@tinkoff/utils/array/find';
import remove from '@tinkoff/utils/array/remove';
import reduce from '@tinkoff/utils/array/reduce';
import compose from '@tinkoff/utils/function/compose';
import keys from '@tinkoff/utils/object/keys';
import map from '@tinkoff/utils/array/map';
import pickBy from '@tinkoff/utils/object/pickBy';
import propOr from '@tinkoff/utils/object/propOr';
import trim from '@tinkoff/utils/string/trim';

import arrayMove from '../../../utils/arrayMove';

import format from 'date-fns/format';

import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

const GREY = '#e0e0e0';
const PRODUCTS_VALUES = ['name', 'company', 'price', 'discountPrice', 'categoryId', 'hidden', 'notAvailable', 'description', 'features', 'filters',
    'metaTitle', 'metaDescription', 'discountTime'];

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> reorder </ReorderIcon>
));

const FeatureSortable = SortableElement(({ index, feature, handleFeatureDelete, handleFeatureChange, classes }) => (
    <FormGroup className={classes.feature} row>
        <ButtonSortable imageClassName={classes.buttonSortable}/>
        <div className={classes.featureGroup}>
            <TextField
                className={classes.featureField}
                label='Свойство'
                value={feature.prop}
                onChange={handleFeatureChange('prop', index)}
                margin='normal'
                variant='outlined'
                required
            />
            <TextField
                className={classes.featureField}
                label='Значение'
                value={feature.value}
                onChange={handleFeatureChange('value', index)}
                margin='normal'
                variant='outlined'
                required
            />
        </div>
        <IconButton aria-label='Delete' className={classes.featureDelButton} onClick={handleFeatureDelete(index)}>
            <DeleteIcon />
        </IconButton>
    </FormGroup>
));

const SlidesFeature = SortableContainer(({ features, classes, ...rest }) =>
    <div className={classes.filtersWrapp}>
        {
            features.map((feature, i) => <FeatureSortable key={i} index={i} feature={feature} {...rest} classes={classes}/>)
        }
    </div>
);

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
    filtersTitle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    filterName: {
        width: '180px',
        display: 'flex',
        alignItems: 'center'
    },
    feature: {
        display: 'flex',
        flexWrap: 'nowrap',
        zIndex: '2000',
        alignItems: 'center'
    },
    filter: {
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
    filterGroup: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%'
    },
    featureField: {
        width: 'calc(50% - 20px)'
    },
    buttonSortable: {
        position: 'relative',
        top: '4px',
        marginRight: '12px',
        cursor: 'pointer'
    },
    featureDelButton: {
        position: 'relative',
        top: '4px',
        marginLeft: '12px'
    },
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    },
    addButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '60px'
    },
    selectFilterOptions: {
        width: '538px'
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
    dateInput: {
        margin: '12px'
    },
    discountTimeWrapp: {
        display: 'flex',
        flexDirection: 'column'
    },
    discountTimeCheckbox: {
        width: '172px'
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

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload)),
    saveProduct: payload => dispatch(saveProduct(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    updateProductFiles: (...payload) => dispatch(updateProductFiles(...payload)),
    updateProductAvatar: (...payload) => dispatch(updateProductAvatar(...payload))
});

class ProductForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getCategories: PropTypes.func.isRequired,
        saveProduct: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        updateProductFiles: PropTypes.func.isRequired,
        updateProductAvatar: PropTypes.func.isRequired,
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
            notAvailable: false,
            features: [],
            filters: [],
            tagsMap: reduce((acc, tag) => {
                acc[tag] = true;

                return acc;
            }, {}, product.tags),
            metaTitle: '',
            metaDescription: '',
            discountTime: '',
            ...pick(PRODUCTS_VALUES, product)
        };

        this.category = category || {
            filters: []
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
            initialAvatarFile: product.avatar,
            initialFiles: product.files,
            removedFiles: [],
            category: category,
            keywordsInput: ''
        };
    }

    componentDidMount () {
        const { product, category } = this.state;

        this.props.getCategories()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
        product.categoryId && this.setFilters(category);
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

    handleDefaultMetaAdd = (option) => () => {
        const { product } = this.state;
        const productName = trim(product.name);
        const productCompany = trim(product.company);
        const TITLE_DEFAULT = `${productCompany} ${productName}`;
        const DESCRIPTION_DEFAULT = `Купите ${productName} от бренда ${productCompany} в интернет-магазине «Raze» по низкой цене - ${!product.discountPrice
            ? product.price : product.discountPrice} грн.`;

        this.handleChange(option);
        this.setState({
            product: {
                ...product,
                [option]: option === 'metaTitle'
                    ? TITLE_DEFAULT
                    : DESCRIPTION_DEFAULT
            }
        });
    };

    getProductPayload = (
        {
            name,
            company,
            price,
            discountPrice,
            discountTime,
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
            discountTime,
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
        this.setState({
            product: {
                ...this.state.product,
                [prop]: event.target.value
            }
        }, () => {
            if (prop === 'categoryId') {
                this.handleCategoryIdChange(event);
            }
        });
    };

    handleKeywordChange = () => event => {
        this.setState({
            keywordsInput: event.target.value,
            product: {
                ...this.state.product,
                keywords: this.state.product.keywords || ''
            }
        });
    };

    handleKeywordAdd = () => {
        const { product, keywordsInput } = this.state;
        const keyword = trim(keywordsInput);

        if (!keyword) {
            return;
        }

        const keywordsArray = !product.keywords ? [] : product.keywords.split(', ');
        const newKeywords = [...keywordsArray, keyword];

        this.setState({
            product: {
                ...product,
                keywords: newKeywords.join(', ')
            },
            keywordsInput: ''
        });
    };

    handleDefaultKeywordsAdd = () => {
        const { product, category } = this.state;
        const productName = trim(product.name);
        const productCompany = trim(product.company);
        const productCategory = trim(category.name);
        const KEYWORDS_DEFAULT = `RAZE, ${productCategory}, ${productCompany}, ${productName}`;

        this.setState({
            product: {
                ...product,
                keywords: KEYWORDS_DEFAULT
            },
            keywordsInput: ''
        });
    };

    handleKeywordDelete = (i) => () => {
        const { product } = this.state;
        const keywordsArray = product.keywords.split(', ');
        const newKeywords = remove(i, 1, keywordsArray);

        this.setState({
            product: {
                ...product,
                keywords: newKeywords.join(', ')
            }
        });
    };

    handleTagChange = prop => (event, value) => {
        const { product } = this.state;

        this.setState({
            product: {
                ...product,
                tagsMap: {
                    ...product.tagsMap,
                    [prop]: value
                }
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

    getFilterValue = (categoryId, filters) => propOr('value', '', find(productFilter => categoryId === productFilter.id, filters));

    setFilters = (thisCategory) => {
        const { category, product } = this.state;
        const filterValue = categoryFilter => product.filters.length && this.getFilterValue(categoryFilter.id, product.filters);

        const filters = map((categoryFilter) => {
            return {
                id: categoryFilter.id,
                value: category === thisCategory ? filterValue(categoryFilter) : ''
            };
        }, thisCategory.filters);

        this.setState({
            product: {
                ...product,
                filters
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

        this.setFilters(category);

        this.category = category;
    };

    handleAvatarFileUpload = avatar => {
        this.setState({
            avatar
        });
    };

    handleFilesUpload = (files, removedFiles) => {
        this.setState({
            files,
            removedFiles
        });
    };

    handleFilterChange = i => event => {
        const { product } = this.state;

        product.filters[i].value = event.target.value;

        this.setState({
            product
        });
    };

    handleCopyFilterToFeature = (name, value) => () => {
        const { product } = this.state;
        let isNew = true;

        const features = product.features.map((feature) => {
            if (feature.prop === name) {
                isNew = false;

                return {
                    ...feature,
                    value
                };
            }
            return feature;
        });

        this.setState({
            product: {
                ...product,
                features: isNew ? [...features, { prop: name, value }] : features
            }
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { product } = this.state;
        this.setState({
            product: {
                ...product,
                features: arrayMove(product.features, oldIndex, newIndex)
            }
        });
    };

    handleDiscountTimeVisibleChange = () => {
        const { product } = this.state;

        !product.discountTime.length
            ? this.setState({
                product: {
                    ...product,
                    discountTime: '-'
                }
            })
            : this.setState({
                product: {
                    ...product,
                    discountTime: ''
                }
            });
    }

    handleDiscountTimeChange = (event) => {
        const { product } = this.state;
        this.setState({
            product: {
                ...product,
                discountTime: format(event.target.value, 'YYYY-MM-DDThh:mm')
            }
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const { id, product } = this.state;
        const productPayload = this.getProductPayload(product);

        (id ? this.props.editProduct({ ...productPayload, id }) : this.props.saveProduct(productPayload))
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
            .then(product => {
                const { avatar } = this.state;

                if (avatar.content) {
                    const formData = new FormData();

                    formData.append(`product-${product.id}-avatar`, avatar.content);

                    return this.props.updateProductAvatar(formData, product.id);
                }
            })
            .then(() => {
                this.props.onDone();
            });
    };

    render () {
        const { classes } = this.props;
        const { product, loading, categoriesOptions, id, hiddenCheckboxIsDisables, initialFiles, initialAvatarFile, keywordsInput } = this.state;
        const titleFiltersLength = !this.category.filters.length && 'В этой категории еще нет фильтров';
        const dataAvailable = (product.name && product.company && product.price);

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
                label='Компания'
                value={product.company}
                onChange={this.handleChange('company')}
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
                label='Скидочная цена'
                value={product.discountPrice}
                onChange={this.handleChange('discountPrice')}
                InputProps={{ inputProps: { min: 1 } }}
                margin='normal'
                variant='outlined'
                type='number'
                fullWidth
            />
            <div className={classes.discountTimeWrapp}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!product.discountTime.length}
                            onChange={this.handleDiscountTimeVisibleChange}
                            color='primary'
                        />
                    }
                    label='Временная скидка'
                    className={classes.discountTimeCheckbox}
                    disabled={hiddenCheckboxIsDisables}
                />
                {
                    !!product.discountTime.length && <TextField
                        id="datetime-local"
                        label="Акция действует до"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
                        value={product.discountTime}
                        className={classes.dateInput}
                        onChange={this.handleDiscountTimeChange}
                        required
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                }
            </div>
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
            <div className={classes.filtersTitle}>
                <Typography variant='h6'>Фильтры</Typography>
                <Typography>{
                    product.categoryId ? titleFiltersLength : 'Вы не выбрали категорию'
                }</Typography>
            </div>
            <div>
                {
                    product.categoryId && this.category.filters.map((filter, i) => {
                        const value = !product.filters[i] ? '' : product.filters[i].value;

                        return filter.type === 'range'
                            ? <FormGroup key={i} className={classes.filter} row>
                                <div className={classes.filterGroup}>
                                    <div className={classes.filterName}>
                                        <Typography variant='h6'>{filter.name}</Typography>
                                    </div>
                                    <TextField
                                        className={classes.featureField}
                                        label='Значение'
                                        value={value}
                                        onChange={this.handleFilterChange(i)}
                                        margin='normal'
                                        variant='outlined'
                                        required
                                        type='number'
                                    />
                                    <Tooltip
                                        title='Копировать в характеристики'
                                        placement='bottom'
                                    >
                                        <IconButton aria-label='Copy' onClick={this.handleCopyFilterToFeature(filter.name, value)}>
                                            <CopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </FormGroup>
                            : <div key={i} className={classes.filterGroup}>
                                <div className={classes.filterName}>
                                    <Typography variant='h6'>{filter.name}</Typography>
                                </div>
                                <TextField
                                    select
                                    label='Значение'
                                    value={value}
                                    onChange={this.handleFilterChange(i)}
                                    margin='normal'
                                    className={classes.selectFilterOptions}
                                    variant='outlined'
                                    InputLabelProps={{
                                        shrink: !!filter.options
                                    }}
                                    required
                                >
                                    {[
                                        '-',
                                        ...filter.options
                                    ].map((option, i) => (
                                        <MenuItem key={i} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Tooltip
                                    title='Копировать в характеристики'
                                    placement='bottom'
                                >
                                    <IconButton aria-label='Copy' onClick={this.handleCopyFilterToFeature(filter.name, value)}>
                                        <CopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>;
                    })
                }
            </div>
            <Divider className={classes.divider}/>
            <div className={classes.features}>
                <Typography variant='h6'>Характеристики</Typography>
                <Fab color='primary' size='small' onClick={this.handleFeatureAdd}>
                    <AddIcon />
                </Fab>
            </div>
            <div>
                <SlidesFeature
                    axis='xy'
                    features={product.features}
                    handleFeatureDelete={this.handleFeatureDelete}
                    handleFeatureChange={this.handleFeatureChange}
                    onSortStart={this.onDragStart}
                    onSortEnd={this.onDragEnd}
                    useDragHandle
                    classes={classes}
                />
            </div>
            <Divider className={classes.divider}/>
            <ProductAvatarFile onAvatarFileUpload={this.handleAvatarFileUpload} initialAvatarFile={initialAvatarFile}/>
            <Divider className={classes.divider}/>
            <ProductFormFiles onFilesUpload={this.handleFilesUpload} initialFiles={initialFiles}/>
            <Divider className={classes.divider}/>
            <div>
                <Typography variant='h6'>Метки</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.tagsMap.topSales}
                            onChange={this.handleTagChange('topSales')}
                            color='primary'
                        />
                    }
                    label='Топ продаж'
                    disabled={hiddenCheckboxIsDisables}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.tagsMap.almostGone}
                            onChange={this.handleTagChange('almostGone')}
                            color='primary'
                        />
                    }
                    label='Товар заканчивается'
                    disabled={hiddenCheckboxIsDisables}
                />
            </div>
            <Divider className={classes.divider}/>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.notAvailable}
                            onChange={this.handleCheckboxChange('notAvailable')}
                            color='primary'
                        />
                    }
                    label='Товара нет в наличии'
                />
            </div>
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
            <Divider className={classes.divider}/>
            <Typography variant='h6'>SEO</Typography>
            <div className={classes.metaForm}>
                <TextField
                    label='Title'
                    value={product.metaTitle}
                    onChange={this.handleChange('metaTitle')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                />
                <div className={classes.metaAdd}>
                    <Tooltip
                        title={dataAvailable
                            ? 'Добавить значение по умолчанию'
                            : 'Заполните поля "Название", "Компания" и "Цена" для добавления значения по умолчанию'}
                        placement='bottom'
                    >
                        <Fab
                            color={dataAvailable ? 'primary' : GREY}
                            size='small'
                            onClick={dataAvailable ? this.handleDefaultMetaAdd('metaTitle') : undefined}
                        >
                            <AutoRenew />
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.metaForm}>
                <TextField
                    label='Description'
                    value={product.metaDescription}
                    onChange={this.handleChange('metaDescription')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                />
                <div className={classes.metaAdd}>
                    <Tooltip
                        title={dataAvailable
                            ? 'Добавить значение по умолчанию'
                            : 'Заполните поля "Название", "Компания" и "Цена" для добавления значения по умолчанию'}
                        placement='bottom'
                    >
                        <Fab
                            color={dataAvailable ? 'primary' : GREY}
                            size='small'
                            onClick={dataAvailable ? this.handleDefaultMetaAdd('metaDescription') : undefined}
                        >
                            <AutoRenew />
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.metaAddKeywords}>
                <TextField
                    label='Новое ключевое слово'
                    value={keywordsInput}
                    onChange={this.handleKeywordChange()}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                />
                <div className={classes.metaAdd}>
                    <Tooltip title='Добавить ключевое слово' placement='bottom'>
                        <Fab size='small' color='primary' onClick={this.handleKeywordAdd} aria-label="Add">
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </div>
                <div className={classes.metaAdd}>
                    <Tooltip
                        title={dataAvailable
                            ? 'Добавить ключевые слова по умолчанию'
                            : 'Заполните поля "Название", "Компания" и "Цена" для добавления значения по умолчанию'}
                        placement='bottom'
                    >
                        <Fab
                            size='small'
                            color={dataAvailable ? 'primary' : GREY}
                            onClick={dataAvailable ? this.handleDefaultKeywordsAdd : undefined}
                            aria-label="Add"
                        >
                            <AutoRenew />
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.keywordsWrapper}>
                {
                    product.keywords &&
                    product.keywords.split(', ').map((option, i) => <Chip
                        key={i}
                        label={option}
                        variant='outlined'
                        color='primary'
                        onDelete={this.handleKeywordDelete(i)}
                        className={classes.metaKeyword}
                    />)
                }
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
