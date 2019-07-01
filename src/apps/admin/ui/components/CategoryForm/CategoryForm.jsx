import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import saveCategory from '../../../services/saveCategory';
import editCategory from '../../../services/editCategory';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';

import Filters from '../Filters/Filters';

const CATEGORY_VALUES = ['name', 'path', 'hidden'];

const mapDispatchToProps = (dispatch) => ({
    saveCategory: payload => dispatch(saveCategory(payload)),
    editCategory: payload => dispatch(editCategory(payload))
});

const materialStyles = theme => ({
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    }
});

class CategoryForm extends Component {
    static propTypes = {
        saveCategory: PropTypes.func.isRequired,
        editCategory: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        category: PropTypes.object,
        classes: PropTypes.object
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
                hidden: false,
                ...pick(CATEGORY_VALUES, category)
            },
            id: prop('id', category)
        };
    }

    handleSubmit = event => {
        event.preventDefault();

        const { id } = this.state;

        (id ? this.props.editCategory({ ...this.state.category, id }) : this.props.saveCategory(this.state.category))
            .then(() => {
                this.props.onDone();
            });
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

    render () {
        const { classes } = this.props;
        const { category, id } = this.state;

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
            <Filters/>
            <Divider className={classes.divider}/>
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(CategoryForm));
