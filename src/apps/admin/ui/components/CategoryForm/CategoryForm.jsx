import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux';
import saveCategory from '../../../services/saveCategory';
import editCategory from '../../../services/editCategory';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';

const CATEGORY_VALUES = ['name', 'path'];

const mapDispatchToProps = (dispatch) => ({
    saveCategory: payload => dispatch(saveCategory(payload)),
    editCategory: payload => dispatch(editCategory(payload))
});

class CategoryForm extends Component {
    static propTypes = {
        saveCategory: PropTypes.func.isRequired,
        editCategory: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        category: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        category: {}
    };

    constructor (...args) {
        super(...args);

        const { category } = this.props;

        this.state = {
            category: pick(CATEGORY_VALUES, category),
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

    render () {
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
            <Button variant='contained' color='primary' type='submit'>
                Сохранить
            </Button>
        </form>;
    }
}

export default connect(null, mapDispatchToProps)(CategoryForm);
