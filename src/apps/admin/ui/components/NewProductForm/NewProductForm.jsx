import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

class NewProductForm extends Component {
    state = {
        product: {}
    };

    handleSubmit = event => {
        event.preventDefault();
    };

    handleChange = prop => event => {
        this.setState({
            product: {
                ...this.state.product,
                [prop]: event.target.value
            }
        });
    };

    render () {
        const { product } = this.state;

        return <form onSubmit={this.handleSubmit}>
            <h2>Добавление нового товара</h2>
            <TextField
                label='Название'
                value={product.name}
                onChange={this.handleChange('name')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
        </form>;
    }
}

export default NewProductForm;
