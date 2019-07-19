import React from 'react';
import pt from 'prop-types';

const OffsetWrapper = ({ children, offsetBottom, offsetTop }) => (
    <div
        style={{
            height: '100%',
            paddingBottom: offsetBottom,
            paddingTop: offsetTop,
            boxSizing: 'border-box'
        }}
    >
        {children}
    </div>
);

OffsetWrapper.propTypes = {
    children: pt.node,
    offsetBottom: pt.number,
    offsetTop: pt.number
};

export default OffsetWrapper;
