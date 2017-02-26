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

export default class Cart extends Component {

  constructor(props) {
    super(props);
    //Initially camera is not shown. It is shown after the user press "Scan"
    this.state = {
      showCamera: this.props.showCamera,
    };
  }

  componentWillUnmount(){
    console.log('unmout');
    this.props.updateCameraState(false);
  }

  onBarCodeRead = (e) => {
      //this.setState({showCamera: false});
      Alert.alert(
          "Barcode Found!",
          "Type: " + e.type + "\nData: " + e.data
      );
      var item = {
        name: 'testitem',
        price: 10
      };
      this.props.addItemToCart(item);
  }

  render() {
     console.log(this.props.cartItems);
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
                  renderRow={(rowData) => <Text>{rowData.name} - {rowData.price}$</Text>}
                  style={{height: 200}}
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
