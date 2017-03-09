'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Button,  Alert} from 'react-native';
import Camera from 'react-native-camera';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
import FaceAPI from './FaceAPIRequestor';
import CustomAPI from './CustomAPIRequestor';
import AccountModal from './accountModal';

import styles from '../styles/main';

let facelist_id = 'facelist_001';
let facelist_data = {
  name: 'My first facelist'
};
let face_api_base_url = 'https://westus.api.cognitive.microsoft.com';
let api_key = ''; //Insert key manually.

export default class FaceRecognition extends Component {
    state = {
      showCamera: true,
      showAccountModal: false,
      photo_data: null
    };

    setCameraVisibility= (val) => {
        this.setState({showCamera: val});
    }

    createFaceList() {
      console.log('IN CREATE FACE LIST');
      FaceAPI.request(
        face_api_base_url + '/face/v1.0/facelists/' + facelist_id,
        'PUT',
        api_key,
        JSON.stringify(facelist_data)
      )
      .then(function(res){
        //alert('Face List Created!');
        console.log('Face List Created!');
      });

    }

  addFaceToFaceList(photo_data) {

    var user_data = {
      name: this.state.name
      //filename: this.state.photo.uri
    };

    return FaceAPI.upload(
      face_api_base_url + '/face/v1.0/facelists/' + facelist_id + '/persistedFaces',
      api_key,
      //this.state.photo_data,
      photo_data,
      {
        userData: JSON.stringify(user_data)
      }
    )
  }

  faceDetect(data) {
    var t = this;
    console.log('IN FACE DETECT');
    //return fetch('https://mywebsite.com/endpoint/', {
    RNFetchBlob.fetch('https://westus.api.cognitive.microsoft.com/face/v1.0/detect', {
        method: 'POST',
        headers: {
          //'Accept': 'application/json',
          'Content-Type': 'application/octet-stream',
          "Ocp-Apim-Subscription-Key": api_key
        },
        body: JSON.stringify({
          data: data
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //return responseJson.movies;
        console.log(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  createUser = (name, id) => {
    this.addFaceToFaceList(this.state.photo_data)
    .then((res) => res.json()) //Parse response data after face is added to the list.
    .then((json) => json)
    .catch((error) => console.log(error))
    .then((res) => CustomAPI.createUser(name, res.persistedFaceId))
    .then((res) => res.json())
    .then((json) => json)
    .then((res) => {
        console.log(res);
        this.setState({showAccountModal: true});
    })
    .catch((error) => console.log(error))
  }

  getSimilarFace = (photo_data) => {

    //First, check if there a face can be detected
    FaceAPI.upload(
      face_api_base_url + '/face/v1.0/detect',
      api_key,
      photo_data
    )
    .then((res) => {
        console.log("face api upload success res");
        return res.json();
    })
    .then((json) => {
        return json;
    })
    .then((facedetect_res) => {
      console.log(facedetect_res);
      if(facedetect_res[0]){
        let face_id = facedetect_res[0].faceId;
        let data = {
          faceId: face_id,
          faceListId: facelist_id,
          maxNumOfCandidatesReturned: 1
        }

        //If a face is found, search for similars
        FaceAPI.request(
          face_api_base_url + '/face/v1.0/findsimilars',
          'POST',
          api_key,
          JSON.stringify(data)
        )
        .then((similarfaces_res) => {

          let similar_face = similarfaces_res[1];
          console.log(similarfaces_res);
          if(similarfaces_res.length>0){
            Alert.alert(
                "Recognized! Face Id is: " + similarfaces_res[0].persistedFaceId
            );
          }else{
            Alert.alert(
            'New User',
              "Face couldn't be recognized. Create a new account?",
              [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                {text: 'Create', onPress: () =>  this.setState({showAccountModal: true, showCamera:false, photo_data: photo_data})}
              ]
            )
          }
          // FaceAPI.request(
          //   face_api_base_url + '/face/v1.0/facelists/' + facelist_id,
          //   'GET',
          //   api_key
          // )
          // .then((facelist_res) => {
          //
          //   let user_data = {};
          //   facelist_res['persistedFaces'].forEach((face) => {
          //     if(face.persistedFaceId == similar_face.persistedFaceId){
          //       user_data = JSON.parse(face.userData);
          //       console.log("SIMILAR");
          //       console.log(user_data);
          //     }
          //   });
          //
          //   this.setState({
          //     similar_photo: {uri: user_data.filename},
          //     message: 'Similar to: ' + user_data.name + ' with confidence of ' + similar_face.confidence
          //   });
          //
          // });

        });
      }else{
        Alert.alert(
            "Couldn't detect a face. Try again."
        );
      }


    })
    .catch(function (error) {
      console.log(error);
    });

  }

  takePicture = () => {
    var t = this;
    if( this.camera ) {
      //this.setState({showAccountModal: true, showCamera:false});

      this.camera.capture({target: Camera.constants.CaptureTarget.disk})
        .then( ( data ) => {
          let base64Img = data.path;

          //Send image data to Microsoft Face API to be processed.
          RNFS.readFile( base64Img, 'base64' )
            .then( res => {
              //t.createFaceList();
              //t.addFaceToFaceList(res);
              t.getSimilarFace(res);
              //this.state.photo_data = res;
              //t.faceDetect(res);
            })
            .catch(err => console.error(err));
        });
    }
  }

  render() {
      console.log('in script face');
      if(this.state.showCamera) {
         return (
          <View style={styles.faceContainer}>
            <Button
              onPress={() => this.takePicture()}
              title="Capture"
              style={styles.capture}
            />
             <Camera
               ref={(cam) => {
                 this.camera = cam;
               }}
               style={styles.preview}
               aspect={Camera.constants.Aspect.fill}
             >
             </Camera>
             <AccountModal
              show = {this.state.showAccountModal}
              createUser = {this.createUser}
              setCameraVisibility = {this.setCameraVisibility}
              />
         </View>
         );
     } else {
       return (
         <View style={styles.container}>
             <Button
               onPress={() => this.takePicture()}
               title="Capture"
               style={styles.capture}
             />
             <AccountModal
              show = {this.state.showAccountModal}
              createUser = {this.createUser}
              setCameraVisibility = {this.setCameraVisibility}
              />
        </View>
      );
    }
  }
}
