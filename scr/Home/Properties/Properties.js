import React from 'react';
import MainScr from '../Properties/Index';
import Add from '../Properties/Form';
import Profile from './Detail/Index';
import Dashboard from '../DashBoard/Index';
import {GlobalState} from '../Properties/Context/GlobalState';
import Filter from './Filter';
import RedirectMeter from './../Properties/Detail/Equipment/RedirectMeter/index';

export default class Prop extends React.Component {
  render() {
    return (
      <GlobalState navigation={this.props.navigation}>
        <MainScr navigation={this.props.navigation}>
          <Add />
        </MainScr>
        <Filter navigation={this.props.navigation} />
      </GlobalState>
    );
  }
}
