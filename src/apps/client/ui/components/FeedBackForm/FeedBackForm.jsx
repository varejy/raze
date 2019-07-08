import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from '../Form/Form';
import getSchema from './feedbackFormSchema';

import { connect } from 'react-redux';

import saveComment from '../../../services/client/saveComment';

import styles from './FeedBackForm.css';

import noop from '@tinkoff/utils/function/noop';

const mapDispatchToProps = (dispatch) => ({
    saveComment: (...payload) => dispatch(saveComment(...payload))
});

class FeedBackForm extends Component {
    static propTypes = {
        productId: PropTypes.string,
        saveComment: PropTypes.func
    };

    static defaultProps = {
        productId: '',
        saveComment: noop
    };

    state = {
        formVisible: true
    }

    handleButtonClick = event => {
        const { productId, saveComment } = this.props;
        const newComment = {
            name: event.fio,
            email: event.email,
            rating: event.rating,
            text: event.comment
        };

        saveComment(productId, newComment);

        this.setState({
            formVisible: false
        });
    }

    render () {
        const { formVisible } = this.state;
        return <section>
            { formVisible
                ? <Form schema={getSchema()} onSubmit={this.handleButtonClick}/>
                : <div className={styles.submitMessage}>
                    Ваш комментарий отправлен на обработку ! В ближайшее время он будет размещен на нашем сайте, Спасибо вам за ваш отзыв !
                </div> }
        </section>;
    }
}

export default connect(null, mapDispatchToProps)(FeedBackForm);
