import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20
  },
  faceContainer: {
    flex: 1,
    marginTop: 35
  },
  cameraContainer: {
    flex: 1,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

module.exports = styles;
