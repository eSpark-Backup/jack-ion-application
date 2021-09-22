import React from 'react';
import MainScr from '../Properties/Index';
import Add from '../Properties/Form';
import Profile from './Detail/Index';
import Dashboard from '../DashBoard/Index';
import { GlobalState } from '../Properties/Context/GlobalState';

export default class Prop extends React.Component {

    render() {
        return (
            <GlobalState navigation={this.props.navigation}>
                <MainScr navigation={this.props.navigation}>
                    <Add />
                </MainScr>
            </GlobalState>
        )
    }
}