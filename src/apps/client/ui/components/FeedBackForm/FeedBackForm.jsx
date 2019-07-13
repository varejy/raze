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
        commentSaved: true
    }

    handleSubmit = values => {
        const { productId, saveComment } = this.props;
        const newComment = {
            name: values.fio,
            email: values.email,
            rating: values.rating,
            text: values.comment
        };

        saveComment(productId, newComment);

        this.setState({
            commentSaved: false
        });
    }

    render () {
        const { commentSaved } = this.state;
        return <section>
            { commentSaved
                ? <Form schema={getSchema()} onSubmit={this.handleSubmit}/>
                : <div className={styles.submitMessage}>
                    Ваш комментарий отправлен на обработку ! В ближайшее время он будет размещен на нашем сайте, Спасибо вам за ваш отзыв !
                </div> }
        </section>;
    }
}

export default connect(null, mapDispatchToProps)(FeedBackForm);
