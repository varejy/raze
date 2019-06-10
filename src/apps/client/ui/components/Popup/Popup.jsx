import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CrossButton from '../CrossButton/CrossButton';

import { connect } from 'react-redux';
import closePopup from '../../../actions/closePopup';

import styles from './Popup.css';

const mapStateToProps = ({ popup }) => {
    return {
        popupContent: popup.content
    };
};

const mapDispatchToProps = (dispatch) => ({
    closePopup: payload => dispatch(closePopup(payload))
});

class Popup extends Component {
    static propTypes = {
        popupContent: PropTypes.object,
        closePopup: PropTypes.func.isRequired
    };

    static defaultProps = {
        popupContent: null
    };

    state = {
        content: null
    };

    componentDidMount () {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.popupContent !== nextProps.popupContent) {
            if (nextProps.popupContent) {
                this.openPopup(nextProps.popupContent);
            } else {
                this.closePopup();
            }
        }
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    openPopup = content => {
        document.body.style.overflowY = 'hidden';
        this.setState({ content });
    };

    closePopup = () => {
        document.body.style.overflowY = 'auto';
        this.setState({ content: null });
    };

    handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.props.closePopup();
        }
    };

    renderPopup = content => <div>
        <div className={styles.coverage} />
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.cross} onClick={this.closePopup}>
                    <CrossButton />
                </div>
                { content }
            </div>
        </div>
    </div>;

    render () {
        const { content } = this.state;

        return <div>
            { content && this.renderPopup(content) }
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
