import React, { Component } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import AboutUsBanner from '../../components/AboutUsBanner/AboutUsBanner';

class MainPage extends Component {
    render () {
        return <section>
            <Carousel/>
            <AboutUsBanner/>
        </section>;
    }
}

export default MainPage;
