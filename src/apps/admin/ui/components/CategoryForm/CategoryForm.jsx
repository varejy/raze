import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AutoRenew from '@material-ui/icons/AutorenewRounded';

import { connect } from 'react-redux';
import saveCategory from '../../../services/saveCategory';
import editCategory from '../../../services/editCategory';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import trim from '@tinkoff/utils/string/trim';

import Filters from '../Filters/Filters';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import remove from '@tinkoff/utils/array/remove';

const GREY = '#e0e0e0';
const CATEGORY_VALUES = ['name', 'path', 'hidden', 'filters', 'metaTitle', 'metaDescription', 'keywords'];

const mapDispatchToProps = (dispatch) => ({
    saveCategory: payload => dispatch(saveCategory(payload)),
    editCategory: payload => dispatch(editCategory(payload))
});

const materialStyles = theme => ({
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
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

class CategoryForm extends Component {
    static propTypes = {
        saveCategory: PropTypes.func.isRequired,
        editCategory: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        categories: PropTypes.array,
        category: PropTypes.object,
        classes: PropTypes.object.isRequired
    };

    static defaultProps = {
        onDone: noop,
        category: {}
    };

    constructor (...args) {
        super(...args);

        const { category } = this.props;

        this.state = {
            category: {
                metaTitle: '',
                metaDescription: '',
                hidden: false,
                ...pick(CATEGORY_VALUES, category)
            },
            id: prop('id', category),
            keywordsInput: ''
        };
    }

    handleDefaultMetaAdd = (option) => () => {
        const { category } = this.state;
        const categoryName = trim(category.name);
        const TITLE_DEFAULT = `${categoryName}`;
        const DESCRIPTION_DEFAULT = `Купите ${categoryName.toLowerCase()} в интернет-магазине «Raze». Качественные ${
            categoryName.toLowerCase()} от лучших брендов в Украине по низким ценам.`;

        this.setState({
            category: {
                ...category,
                [option]: option === 'metaTitle'
                    ? TITLE_DEFAULT
                    : DESCRIPTION_DEFAULT
            }
        });
    };

    handleKeywordChange = () => event => {
        this.setState({
            keywordsInput: event.target.value,
            category: {
                ...this.state.category,
                keywords: this.state.category.keywords || ''
            }
        });
    };

    handleKeywordAdd = () => {
        const { category, keywordsInput } = this.state;
        const keyword = trim(keywordsInput);

        if (!keyword) {
            return;
        }

        const keywordsArray = !category.keywords ? [] : category.keywords.split(', ');

        const newKeywords = [...keywordsArray, keyword];

        this.setState({
            category: {
                ...category,
                keywords: newKeywords.join(', ')
            },
            keywordsInput: ''
        });
    };

    handleDefaultKeywordsAdd = () => {
        const { category } = this.state;
        const productCategory = trim(category.name);
        const KEYWORDS_DEFAULT = `RAZE, ${productCategory}`;

        this.setState({
            category: {
                ...category,
                keywords: KEYWORDS_DEFAULT
            },
            keywordsInput: ''
        });
    };

    handleKeywordDelete = (i) => () => {
        const { category } = this.state;
        const keywordsArray = category.keywords.split(', ');
        const newKeywords = remove(i, 1, keywordsArray);

        this.setState({
            category: {
                ...category,
                keywords: newKeywords.join(', ')
            }
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { id } = this.state;

        (
            id
                ? this.props.editCategory({ ...this.state.category, id })
                : this.props.saveCategory({
                    ...this.state.category,
                    positionIndex: this.props.categories.length
                })
        )
            .then(this.props.onDone());
    };

    handleChange = prop => event => {
        this.setState({
            category: {
                ...this.state.category,
                [prop]: event.target.value
            }
        });
    };

    handleCheckboxChange = prop => (event, value) => {
        this.setState({
            category: {
                ...this.state.category,
                [prop]: value
            }
        });
    };

    handleFilterChange = filters => {
        this.setState({
            category: {
                ...this.state.category,
                filters
            }
        });
    };

    render () {
        const { category, id, keywordsInput } = this.state;
        const { classes } = this.props;
        const dataAvailable = category.name;

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>{id ? 'Редактирование категории' : 'Добавление новой категории'}</Typography>
            <TextField
                label='Название'
                value={category.name}
                onChange={this.handleChange('name')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
            <TextField
                label='Путь'
                value={category.path}
                onChange={this.handleChange('path')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
            <Filters onFilterChange={this.handleFilterChange} filters={category.filters}/>
            <div>
                <FormControlLabel
                    control ={
                        <Checkbox
                            checked={category.hidden}
                            onChange={this.handleCheckboxChange('hidden')}
                            color='primary'
                        />
                    }
                    label='Скрыть категорию и товары в ней'
                />
            </div>
            <Divider className={classes.divider}/>
            <Typography variant='h6'>SEO</Typography>
            <div className={classes.metaForm}>
                <TextField
                    label='Title'
                    value={category.metaTitle}
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
                            : 'Заполните полe "Название" для добавления значения по умолчанию'}
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
                    value={category.metaDescription}
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
                            : 'Заполните полe "Название" для добавления значения по умолчанию'}
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
                            ? 'Добавить значение по умолчанию'
                            : 'Заполните полe "Название" для добавления значения по умолчанию'}
                        placement='bottom'
                    >
                        <Fab
                            color={dataAvailable ? 'primary' : GREY}
                            size='small'
                            onClick={dataAvailable ? this.handleDefaultKeywordsAdd : undefined}
                        >
                            <AutoRenew />
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.keywordsWrapper}>
                {
                    category.keywords &&
                    category.keywords.split(', ').map((option, i) => <Chip
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

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(CategoryForm));
