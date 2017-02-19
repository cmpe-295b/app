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
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
import Requestor from './Requestor';
import styles from '../styles/main';

let facelist_id = 'facelist_001';
let facelist_data = {
  name: 'My first facelist'
};
let face_api_base_url = 'https://westus.api.cognitive.microsoft.com';
let api_key = ''; //Insert key manually.

export default class FaceRecognition extends Component {
    state = {showCamera: true};


    createFaceList() {
      console.log('IN CREATE FACE LIST');
      Requestor.request(
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

    Requestor.upload(
      face_api_base_url + '/face/v1.0/facelists/' + facelist_id + '/persistedFaces',
      api_key,
      //this.state.photo_data,
      photo_data,
      {
        userData: JSON.stringify(user_data)
      }
    )
    .then((res) => {
      alert('Face was added to face list!');
    });

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

  uploadImage (url, api_key, photo, query_params){
    if(typeof query_params != 'undefined'){
      //construct the query parameter from the query_params object
      let ret = [];
      for(let d in query_params){
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(query_params[d]));
      }

      let url = url + "?" + ret.join("&"); //combine the query parameters with the URL
    }

    return RNFetchBlob.fetch('POST', url, {
        'Accept': 'application/json',
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': api_key
    }, photo)
    .then((res) => {
      //console.log(res.json());
      return res.json();
    })
    .then((json) => {
      console.log(json);
      return json;
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getSimilarFace(photo_data) {

    //First, check if there a face can be detected
    Requestor.upload(
      face_api_base_url + '/face/v1.0/detect',
      api_key,
      photo_data
    )
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
        Requestor.request(
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
                "Face couldn't be recognized. Create a new account?"
            );
          }
          // Requestor.request(
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
          <View style={styles.container}>
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
        </View>
      );
    }
  }
}
