import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CrossButton from '../CrossButton/CrossButton';
import Scroll from '../Scroll/Scroll';

import { connect } from 'react-redux';
import closePopup from '../../../actions/closePopup';

import styles from './Popup.css';
import { withRouter } from 'react-router-dom';

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
        document.body.style.overflowY = 'auto';
    }

    openPopup = content => {
        this.setState({ content });
        document.body.style.overflowY = 'hidden';
    };

    closePopup = () => {
        this.setState({ content: null });
        document.body.style.overflowY = 'auto';
    };

    handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.props.closePopup();
        }
    };

    renderPopup = content => <div className={styles.popup}>
        <div className={styles.coverage} onClick={this.props.closePopup}>
            <div className={styles.cross}>
                <CrossButton />
            </div>
        </div>
        <div className={styles.container}>
            <Scroll>
                <div className={styles.scrollContentOuter}>
                    <div className={styles.scrollContentInner}>
                        { content }
                    </div>
                </div>
            </Scroll>
        </div>
    </div>;

    render () {
        const { content } = this.state;

        return <div>
            { content && this.renderPopup(content) }
        </div>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Popup));
