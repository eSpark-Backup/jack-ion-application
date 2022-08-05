import React from 'react';
import MainScr from '../Properties/Index';
import {GlobalState} from '../Properties/Context/GlobalState';
import Filter from './Filter';

export default class Prop extends React.Component {
  render() {
    return (
      <GlobalState navigation={this.props.navigation}>
        <MainScr navigation={this.props.navigation}></MainScr>
        <Filter navigation={this.props.navigation} />
      </GlobalState>
    );
  }
}
