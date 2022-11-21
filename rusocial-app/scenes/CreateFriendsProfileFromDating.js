import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import BlockedUserItem from '../components/BlockedUserItem';
import Icon from 'react-native-vector-icons/FontAwesome'

import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';
import cache from '../in_memory_cache.js';


import navlogo from '../assets/images/NBF.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let clickedCreate = false;

class Swipe extends Component {

  componentDidMount() {
    this.createProfileCall();
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  createProfileCall = () => {
    var details = {
      "token": GLOBAL.authToken
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");


    return fetch('https://rumine.ca/_apiv2/gw/fp/m', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,

    }).then((response) => response.json())
      .then((responseJson) => {
        clickedCreate = false;
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("We could not create your profile right now. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          //Do local profile management
          GLOBAL.friends = {};
          GLOBAL.friends.firstname_display = GLOBAL.profile.firstname_display;
          if(GLOBAL.profile.lastname == undefined){
            GLOBAL.friends.lastname = "";
          }
          else{
            GLOBAL.friends.lastname = GLOBAL.profile.lastname;
          }
          GLOBAL.friends.birthdate = GLOBAL.profile.birthdate;
          GLOBAL.friends.pronouns = GLOBAL.profile.pronouns;
          GLOBAL.friends.year = GLOBAL.profile.year;
          GLOBAL.friends.program = GLOBAL.profile.program;
          GLOBAL.friends.top_5_spotify = GLOBAL.profile.top_5_spotify;
          GLOBAL.friends.badges = GLOBAL.profile.badges;
          GLOBAL.friends.interests = GLOBAL.profile.interests;
          GLOBAL.friends.bio = GLOBAL.profile.bio;
          GLOBAL.friends.image0 = GLOBAL.profile.image0;
          GLOBAL.friends.algo_pref = 0;
          GLOBAL.friends.show_me = true;
          this._storeData("friends-me", JSON.stringify(GLOBAL.friends));
          if(this.props.pass){
            this.props.pass.setState({friendsProfileExists:true, friendsEnabled: true, myFriendsPicture: "https://rumine.ca/_i/s/i.php?i=" + GLOBAL.profile.image0});
            GLOBAL.justMadeFriendsProfile = true;
          }
          this.setState({
            calledCreate: false
          })
        }
      })
      .catch((error) => {
        clickedCreate = false;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  state = {
    calledCreate: true
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{
        flex:1}}>
      <SafeAreaView style={{
        backgroundColor: "white"
      }}>
      </SafeAreaView>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Create Profile</Text>
          <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
          </View>
        </View>
        <ScrollView>
          <View style={{margin: 15, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>We're going to use this information from your dating profile to create your friends profile:</Text>
            <View style={{marginTop: 10}}>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Name and Pronouns.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Birthdate.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Program and Year.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Interests.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Profile Badges.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Spotify Artists.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Bio.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Main Image.</Text>
            </View>
            <Text style={{marginTop: 10, textAlign: "center", fontSize: 16, color: "black", fontFamily: "Raleway-Medium"}}>You'll have an opportunity to edit all of these in just a minute.</Text>
            <View style={{backgroundColor: "#f8f8ff"}}>


          </View>
          </View>
          <View style={{height: 100, width: '100%', justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {if(!this.state.calledCreate){Actions.replace('editfriendsprofile');}}} style={{margin: 5, height: 45, padding: 15, width: '60%', backgroundColor: "#5bb8ff", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
              {(this.state.calledCreate)?
                <View>
                  <ActivityIndicator size="small" color="white" />
                </View>
                :<Text style={{textAlign: "center", fontSize: 14, color: "white", fontFamily: "Raleway-Bold"}}>Continue to Edit Profile</Text>}
            </TouchableOpacity>
          </View>
          <View style={{height: 50, width: '100%', justifyContent: "center", alignItems: "center"}}>
          </View>
        </ScrollView>
      </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
