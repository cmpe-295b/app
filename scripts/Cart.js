'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ListView
} from 'react-native';
import Camera from 'react-native-camera';
import styles from '../styles/main';
import { List, ListItem } from 'react-native-elements';
import CustomAPI from './CustomAPIRequestor';
import _ from 'lodash';

export default class Cart extends Component {

  constructor(props) {
    super(props);
    //Initially camera is not shown. It is shown after the user press "Scan"
    this.state = {
      showCamera: this.props.showCamera,
    };
    this.onBarCodeRead = _.debounce(this.onBarCodeRead,1000);
  }

  componentWillUnmount(){
    this.props.updateCameraState(false);
  }

  getProductByBarcodeId = (id) => {
    id.toString();
    CustomAPI.getProductByBarcodeId(id)
      .then((res) => res.json())
      .then((json) => json)
      .then((res) => {
          var item = {
            name: res.title,
            price: res.price
          };
          this.props.addItemToCart(item);
      })
      .catch((error) => console.log(error))
  }

  onBarCodeRead = (e) => {
      //this.setState({showCamera: false});
      // Alert.alert(
      //     "Barcode Found!",
      //     "Type: " + e.type + "\nData: " + e.data
      // );
      this.getProductByBarcodeId(e.data);
  }

  render() {
       //dataSource: ds.cloneWithRows(this.props.cartItems)
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      let dataSource = ds.cloneWithRows(this.props.cartItems);
      const totalCost = this.props.cartItems.reduce((acc, item) => acc + item.price, 0);


      if(this.props.showCamera) {
         return (
          <View style={styles.cameraContainer}>
             <Camera
               ref={(cam) => {
                 this.camera = cam;
               }}
               style={styles.preview}
               aspect={Camera.constants.Aspect.fill}
               onBarCodeRead={this.onBarCodeRead}>
             </Camera>
         </View>
         );
     } else {
       return (
         <View style={styles.container}>
            <Button
              onPress={() =>  this.props.updateCameraState(true)}
              title="Scan"
              color="#841584"
            />
            {this.props.cartItems.length !== 0
              ?
              <View>
                <ListView
                  dataSource={dataSource}
                  renderRow={(rowData) =>
                    <ListItem
                      roundAvatar
                      key={rowData.id}
                      title={rowData.name + " " + rowData.price + "$"}
                      hideChevron = {true}
                      avatar={{uri:"http://www.bgclynchburg.org/editor/dudaone/images/placeholders/imgPlaceholder3.png"}}
                    />
                  }
                />
                <Text>Total: {totalCost}$</Text>
              </View>

              :
              <Text>{"Currently, you have no items in your cart. Press 'Scan' to add your first item!"}</Text>
            }

        </View>
      );
  }
}
}
