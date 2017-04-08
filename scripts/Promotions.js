'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  ListView,
} from 'react-native';
import Camera from 'react-native-camera';
import styles from '../styles/main';
import CustomAPI from './CustomAPIRequestor';
import { List, ListItem } from 'react-native-elements';


export default class Promotions extends Component {

  // TODO: Make a call to get real promotions
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([''])
    };
  }

  componentDidMount(){
    CustomAPI.getPromotions('someuserid')
      .then((res) => res.json())
      .then((json) => json)
      .then((res) => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(res)
          });
      })
      .catch((error) => console.log(error))
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <ListItem
              roundAvatar
              key={rowData.id}
              title={rowData.title + " (" + rowData.newPrice + "% off)"}
              subtitle={"Original price: " + rowData.price + " New Price: " + rowData.newPrice}
              onPress={() => this.props.selectTab('mapTab', rowData.location)}
              avatar={{uri:"http://www.bgclynchburg.org/editor/dudaone/images/placeholders/imgPlaceholder3.png"}}
            />
          }
        />
      </View>
    );
  }
}
