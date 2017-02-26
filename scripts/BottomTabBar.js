'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Cart from './Cart';
import FaceRecognition from './FaceRecognition';
import Promotions from './Promotions';

export default class TabBar extends Component {
  static title = '<TabBarIOS>';
  static description = 'Tab-based navigation.';
  static displayName = 'TabBarExample';

  state = {
    selectedTab: 'cartTab',
    cartItems: [],
    notifCount: 0,
    presses: 0,
    showCamera: false
  };

  updateCameraState = (val) => {
    this.setState({showCamera: val});
  }

  addItemToCart = (item) => {
    this.setState(
      {
        cartItems: this.state.cartItems.concat([item]),
        showCamera: false
      }
    );
  }

  _renderContent = (color: string, pageText: string, num?: number) => {

    if(pageText === 'cart'){
      return(
        <Cart
          cartItems = {this.state.cartItems}
          addItemToCart = {this.addItemToCart}
          showCamera = {this.state.showCamera}
          updateCameraState = {this.updateCameraState}
         />
      );
    }else if(pageText === 'recognize'){
      return(
        <FaceRecognition />
      );
    }else if(pageText === 'promotions'){
      return(
        <Promotions />
      );
    }else{
      return (
        <View style={[styles.tabContent, {backgroundColor: color}]}>
          <Text style={styles.tabText}>{pageText}</Text>
          <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <TabBarIOS
        unselectedTintColor="gray"
        tintColor="white"
        unselectedItemTintColor="red"
        barTintColor="#094742">
        <Icon.TabBarItemIOS
          title="Promotions"
          iconName="ios-pricetag"
          selectedIconName="ios-pricetag-outline"
          renderAsOriginal          selected={this.state.selectedTab === 'promotionTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'promotionTab',
            });
          }}>
          {this._renderContent('#414A8C', 'promotions')}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="Map"
          iconName="ios-map"
          selectedIconName="ios-map-outline"
          renderAsOriginal
          selected={this.state.selectedTab === 'mapTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'mapTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          {this._renderContent('#783E33', 'Map Page', this.state.notifCount)}
          </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="Cart"
          iconName="ios-cart"
          selectedIconName="ios-cart-outline"
          renderAsOriginal
          selected={this.state.selectedTab === 'cartTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'cartTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          {this._renderContent('#fff', 'cart', this.state.notifCount)}
          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            title="Face"
            iconName="ios-person"
            selectedIconName="ios-person-outline"
            renderAsOriginal
            selected={this.state.selectedTab === 'recognizeTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'recognizeTab',
                notifCount: this.state.notifCount + 1,
              });
            }}>
            {this._renderContent('#fff', 'recognize', this.state.notifCount)}
            </Icon.TabBarItemIOS>
      </TabBarIOS>
    );
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});
