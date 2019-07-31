import React, { Component } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import AboutUsBanner from '../../components/AboutUsBanner/AboutUsBanner';
import TopProducts from '../../components/TopProducts/TopProducts';

class MainPage extends Component {
    render () {
        return <section>
            <Carousel/>
            <TopProducts/>
            <AboutUsBanner/>
        </section>;
    }
}

export default MainPage;
