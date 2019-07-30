import React, { Component } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import AboutUsBanner from '../../components/AboutUsBanner/AboutUsBanner';
import TopProductsWidget from '../../components/TopProductsWidget/TopProductsWidget';

class MainPage extends Component {
    render () {
        return <section>
            <Carousel/>
            <TopProductsWidget/>
            <AboutUsBanner/>
        </section>;
    }
}

export default MainPage;
