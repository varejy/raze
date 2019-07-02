import React, { Component } from 'react';
import Form from '../Form/Form';
import getSchema from './feedbackFormSchema';

class FeedBackForm extends Component {
    render () {
        return <section>
            <Form schema={getSchema()}/>
        </section>;
    }
}

export default FeedBackForm;
