

import React from 'react';
import ChatScreen from '../../ContactUs/chat/index';
import { GlobalState } from '../../Home/Properties/Context/GlobalState';

export default class Prop extends React.Component {

    render() {
        return (
            <GlobalState>
                <ChatScreen navigation={this.props.navigation} />
            </GlobalState>
        )
    }
}