'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  ListView,
} from 'react-native';
import Camera from 'react-native-camera';
import styles from '../styles/main';

export default class Promotions extends Component {

  // TODO: Make a call to get real promotions
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Promotion 1', 'Promotion 2', 'Promotion 3'
      ])
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData}</Text>}
        />
      </View>
    );
  }
}
