import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';

import { Actions } from 'react-native-router-flux';
//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Profile from '../components/Profile';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class Swipe extends Component {

  getWindowDimension(event) {
      this.device_width = event.nativeEvent.layout.width,
      this.device_height = event.nativeEvent.layout.height

      var bottomBarIsOpen = (this.device_height<screenHeight);
      this.setState({
        bottomBarIsOpen: bottomBarIsOpen
      })

    }

  componentDidMount() {
    if(this.props.fromMatchConvo){
      this.getUserProfile();
    }
  }

  state = {
    bottomBarIsOpen: false,
    username: "",
    birthdate: "",
    program: "",
    year: "",
    bio: "",
    caption0: "",
    caption1: "",
    caption2: "",
    storyHeadline: "",
    story: "",
    picture0: "",
    picture1: "",
    picture2: "",
    picture3: ""
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  getUserProfile = () => {
    var details = {
      "token": GLOBAL.authToken,
      "otherUserId": this.props.userid
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/p', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error getting this profile. Please try again later.");
        }
        else{
          if(responseJson.token != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          var userData = responseJson.status;
          var profData = userData.profile;
          var imageData = userData.images;
          if(imageData.length == 0){
            imageData = Array(4)
          }
          else if(imageData.length == 1){
            var extra_imageData = Array(3);
            var imageData = imageData.concat(extra_imageData);
          }
          else if(imageData.length == 2){
            var extra_imageData = Array(2)
            var imageData = imageData.concat(extra_imageData);
          }
          else if(imageData.length == 3){
            var extra_imageData = Array(1)
            var imageData = imageData.concat(extra_imageData);
          }
          try{
            var image0 = imageData[0].imgid;
          }
          catch{
            var image0 = "";
          }
          try{
            var image1 = imageData[1].imgid;
          }
          catch{
            var image1 = "";
          }
          try{
            var image2 = imageData[2].imgid;
          }
          catch{
            var image2 = "";
          }
          try{
            var image3 = imageData[3].imgid;
          }
          catch{
            var image3 = "";
          }
          this.setState({
            username: profData.firstname_display,
            birthdate: profData.birthdate,
            program: profData.program,
            year: profData.year,
            pronouns: profData.pronouns,
            lookingFor: profData.lookingfor,
            bio: profData.bio,
            caption0: profData.caption0,
            caption1: profData.caption1,
            caption2: profData.caption2,
            storyHeadline: profData.storyheadline,
            story: profData.story,
            picture0: image0,
            picture1: image1,
            picture2: image2,
            picture3: image3
          });
          }
        })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }


  render() {
    console.disableYellowBox = true;

    return (
      //
      <SafeAreaView style={{
        flex:1,
        backgroundColor: "#ffffff"
      }}>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}
      onLayout={(event) => this.getWindowDimension(event)}
      >
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
        {(!this.props.fromMatchConvo)?
        <Profile
          preview={true}
          fromMatchConvo={this.props.fromMatchConvo}
          renderNextFunc={() => this.props.renderNextFunc()}
          picture0={this.props.picture0}
          username={this.props.username}
          pronouns={this.props.pronouns}
          lookingFor={this.props.lookingFor}
          birthdate={this.props.birthdate}
          program={this.props.program}
          year={this.props.year}
          bio={this.props.bio}
          picture1={this.props.picture1}
          caption0={this.props.caption0}
          picture2={this.props.picture2}
          caption1={this.props.caption1}
          storyHeadline={this.props.storyHeadline}
          story={this.props.story}
          picture3={this.props.picture3}
          caption2={this.props.caption2}
        />:
        <Profile
          preview={true}
          fromMatchConvo={this.props.fromMatchConvo}
          picture0={this.state.picture0}
          username={this.state.username}
          pronouns={this.state.pronouns}
          lookingFor={this.state.lookingFor}
          birthdate={this.state.birthdate}
          program={this.state.program}
          year={this.state.year}
          bio={this.state.bio}
          picture1={this.state.picture1}
          caption0={this.state.caption0}
          picture2={this.state.picture2}
          caption1={this.state.caption1}
          storyHeadline={this.state.storyHeadline}
          story={this.state.story}
          picture3={this.state.picture3}
          caption2={this.state.caption2}
        />}
      </View>
      </SafeAreaView>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
