import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from '../Form/Form';
import getSchema from './feedbackFormSchema';

import { connect } from 'react-redux';

import getProductComments from '../../../services/client/getProductComments';

import noop from '@tinkoff/utils/function/noop';

const mapDispatchToProps = (dispatch) => ({
    getProductComments: payload => dispatch(getProductComments(payload))
});

class FeedBackForm extends Component {
    static propTypes = {
        productId: PropTypes.string,
        getProductComments: PropTypes.func
    };

    static defaultProps = {
        productId: '',
        getProductComments: noop
    };

    handleButtonClick = event => {
        const { productId } = this.props;

        const newComment = {
            name: event.fio,
            email: event.email,
            rating: event.rating,
            text: event.comment
        };

        this.props.getProductComments(productId);
    }

    render () {
        return <section>
            <Form schema={getSchema()} onSubmit={this.handleButtonClick}/>
        </section>;
    }
}

export default connect(null, mapDispatchToProps)(FeedBackForm);
