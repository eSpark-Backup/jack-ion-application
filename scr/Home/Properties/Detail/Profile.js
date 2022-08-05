import React from 'react';
import MainScr from '../Detail/Index'
import { GlobalState } from '../Context/GlobalState';

export default class Prop extends React.Component {

    render() {
        return (
            <GlobalState>
                <MainScr navigation={this.props.navigation} />
            </GlobalState>
        )
    }
}