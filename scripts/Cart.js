'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Alert,
} from 'react-native';
import Camera from 'react-native-camera';
import styles from '../styles/main';

export default class Cart extends Component {
  //Initially camera is not shown. It is shown after the user press "Scan"
  state = {showCamera: false};

  onBarCodeRead = (e) => {
      this.setState({showCamera: false});
      Alert.alert(
          "Barcode Found!",
          "Type: " + e.type + "\nData: " + e.data
      );
  }

  render() {
      if(this.state.showCamera) {
         return (
          <View style={styles.container}>
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
               onPress={() =>  this.setState({showCamera: true})}
               title="Scan"
               color="#841584"
             />
        </View>
      );
  }
}
}
