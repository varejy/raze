import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

const outsideClick = WrappedComponent => {
    class OutsideClick extends PureComponent {
        componentWillUnmount () {
            document.addEventListener('mousedown', this.clickFn);
            document.addEventListener('touchstart', this.clickFn);
            document.addEventListener('focus', this.focusFn, true);
        }

        turnOnClickOutside = (component, handleOutsideClick) => {
            this.clickFn = ((localNode, eventHandler) => event => {
                let source = event.target;
                let found = false;

                this.handleClick();

                while (source.parentNode) {
                    found = source === localNode;

                    if (found) {
                        return;
                    }
                    source = source.parentNode;
                }

                eventHandler.call(component, event);
            })(ReactDOM.findDOMNode(component), handleOutsideClick);
            /**
             * IE11 11.0.47 calls FocusEvent handlers with useCapture both
             * for the original target and body
             */
            this.focusFn = function focusFn (event) { // eslint-disable-line func-style
                if (event.target === document.body) {
                    return;
                }
                this.clickFn(event);
            };

            document.addEventListener('mousedown', this.clickFn);
            document.addEventListener('touchstart', this.clickFn);
            document.addEventListener('focus', this.focusFn, true);
        };

        handleClick = () => {
            document.removeEventListener('mousedown', this.clickFn);
            document.removeEventListener('touchstart', this.clickFn);
            document.removeEventListener('focus', this.focusFn, true);
        };

        render () {
            return <WrappedComponent
                {...this.props}
                turnOnClickOutside={this.turnOnClickOutside}
            />;
        }
    }

    return OutsideClick;
};

export default outsideClick;
