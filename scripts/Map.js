'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image
} from 'react-native';
import styles from '../styles/main';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class Map extends Component {

  constructor(props) {
    super(props);
  }

  render() {
      if(this.props.itemLocation){
        return (
         <View style={styles.mapContainer}>
           <Image
             style={styles.map}
             source={require('../styles/img/storemap.png')}
             >
               <Icon name="place" size={30} style={{top:this.props.itemLocation[1], left: this.props.itemLocation[0], backgroundColor: 'rgba(255, 255, 255, 0)'}} color="#900" />
           </Image>
         </View>
       );
     }else{
       return (
        <View style={styles.mapContainer}>
          <Image
            style={styles.map}
            source={require('../styles/img/storemap.png')}
            >
          </Image>
        </View>
      );
     }


  }
}
