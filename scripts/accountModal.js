import React, { Component } from 'react';
import { Modal, Text, TextInput, TouchableHighlight, Button, View } from 'react-native';

export default class AccountModal extends Component {

  state = {
    modalVisible: this.props.show,
    nameInput: ""
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  pressCreate = () => {
    this.props.createUser(this.state.nameInput);
  }

  render() {
    console.log(this.props.show);
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22, padding: 30}}>
          <View>
             <TextInput
               style={{height: 40}}
               placeholder="Enter your name"
               onChangeText={(nameInput) => this.setState({nameInput})}
               value={this.state.nameInput}
             />
             <Text style={{padding: 10, fontSize: 42}}>
               {this.state.nameInput}
             </Text>
             <Button
               onPress={() => this.pressCreate()}
               title="Create"
             />
            <Button
              onPress={() => {
                  this.setModalVisible(false)
                  this.props.setCameraVisibility(true);
                }
              }
              title="Cancel"
            />

          </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>

      </View>
    );
  }
}
