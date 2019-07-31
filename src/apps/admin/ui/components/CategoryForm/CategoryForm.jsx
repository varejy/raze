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

const GREY = '#e0e0e0';
const CATEGORY_VALUES = ['name', 'path', 'hidden', 'filters', 'metaTitle', 'metaDescription'];

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
    metaAddDefault: {
        marginLeft: '12px',
        marginTop: '8px'
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
            id: prop('id', category)
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
                ...this.state.category,
                [option]: option === 'metaTitle'
                    ? TITLE_DEFAULT
                    : DESCRIPTION_DEFAULT
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
        const { category, id } = this.state;
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
                <div className={classes.metaAddDefault}>
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
                <div className={classes.metaAddDefault}>
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
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(CategoryForm));
