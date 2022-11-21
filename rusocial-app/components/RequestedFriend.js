import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'

import GLOBAL from '../global.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class MatchListItem extends Component {

  state = {
    areYouSure: false
  }

  renderMessage = () => {
    if(this.props.message.length > 47){
      return this.props.message.substring(0,47) + "...";
    }
    else{
      return this.props.message
    }
  }

  acceptFriendRequest = () => {
    var details = {
      "token": GLOBAL.authToken,
      "userid": this.props.userid
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");


    return fetch('https://rumine.ca/_apiv2/gw/ft/ar', {
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
          alert("We could not accept your request. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          this.props.pass.getPendingRequests();
          this.props.pass.getFriends();
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  removeFriendRequest = () => {
    this.setState({
      areYouSure: false
    })
    var details = {
      "token": GLOBAL.authToken,
      "userid": this.props.userid
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");


    return fetch('https://rumine.ca/_apiv2/gw/ft/dfr', {
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
          alert("We could not delete your request. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          this.props.pass.getPendingRequests();
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  render() {
    console.disableYellowBox = true;

    return (
          <View style={{height: 60, paddingLeft: 20, paddingRight: 20, width: '100%', marginTop: 10, flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.previewprofile({fromFriendsConvo: true, userid: this.props.userid})} style={{flexDirection: "row", minWidth: 200}}>
            <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: "gray"}}>
              <FastImage source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.image, priority: FastImage.priority.normal}} style={{height: 50, width: 50, borderRadius: 25}}></FastImage>
            </View>
            <Text style={{fontSize: 18, paddingLeft: 10, paddingTop: 15, paddingBottom: 15, color: "black", fontFamily: "Raleway-Regular"}}>{this.props.firstname_display}</Text>
          </TouchableOpacity>
          <View style={{flexDirection: "row", position: 'absolute', right: 25}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.acceptFriendRequest()} style={{height: 50, width: 40, justifyContent: "center", alignItems: "center"}}>
              <LineIcon name="check" size={25} color="green" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({areYouSure: true})} style={{height: 50, width: 40, justifyContent: "center", alignItems: "center"}}>
              <LineIcon name="close" size={25} color="#ff5b5b" />
            </TouchableOpacity>
          </View>
          <View>
            <Dialog.Container visible={this.state.areYouSure}>
              <Dialog.Title>Delete Request</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete {this.props.firstname_display}'s request?
              </Dialog.Description>
              <Dialog.Button onPress={() => this.setState({areYouSure: false})} label="Cancel" />
              <Dialog.Button onPress={() => this.removeFriendRequest()} label="Yes" />
            </Dialog.Container>
          </View>
          </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default MatchListItem;
