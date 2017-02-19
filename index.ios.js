import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import TabBar from './scripts/BottomTabBar';

export default class cmpe295 extends Component {

  render(){
    //Initialize the bottom navigation menu
    return(
      <TabBar />
    )
  }
}


AppRegistry.registerComponent('cmpe295', () => cmpe295);
