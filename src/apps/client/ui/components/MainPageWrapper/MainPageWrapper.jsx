import React, { Component } from 'react';
import Carousel from '../Carousel/Carousel.jsx';
import AboutUsBanner from '../AboutUsBanner/AboutUsBanner.jsx';

class MainPageWrapper extends Component {
    render () {
        return <section>
            <Carousel/>
            <AboutUsBanner/>
        </section>;
    }
}

export default MainPageWrapper;
