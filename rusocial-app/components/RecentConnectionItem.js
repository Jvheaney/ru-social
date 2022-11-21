import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome'

import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'

import GLOBAL from '../global.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


var allowStartConvo = true;
class MatchListItem extends Component {

  state = {

  }

  startConvo = () => {
    if(allowStartConvo){
      allowStartConvo = false;
      var details = {
        "token": GLOBAL.authToken,
        "userid": this.props.userid,
        "type":this.props.type
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/m/sc', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            allowStartConvo = true;
            Actions.replace("login");
          }
          else if(responseJson.status == "wrongdata"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowStartConvo = true;
            alert("There was an error starting this conversation.");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowStartConvo = true;
            alert("There was an error starting this conversation.");
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowStartConvo = true;
            Actions.matchConvo({matchid: responseJson.data.matchid, _type: this.props.type, avatar: 'https://rumine.ca/_i/s/i.php?i=' + this.props.avatar, username: this.props.name, userid: this.props.userid})
          }
        })
      .catch((error) => {
        allowStartConvo = true;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.startConvo()} >
            <View style={{marginLeft: 6, marginRight: 6, minHeight: 50, width: 50, height: 'auto', backgroundColor: "white", flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{alignItems: 'center'}}>
                <View style={{minHeight: 50, height: 'auto', width: 50, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                  <View style={{minHeight: 50, height: 'auto', width: 50, backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: screenWidth*0.1, overflow: "hidden"}}>
                    <FastImage source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.avatar, priority: FastImage.priority.normal}} style={{height: 50, width: 50, borderRadius: screenWidth*0.1, overflow: "hidden"}}></FastImage>
                  </View>
                  <View style={{position: "absolute", bottom: 0, right: 0, paddingLeft: 1, paddingTop: 1, height: 20, width: 20, borderRadius: 10, backgroundColor: (this.props.type==0)?"#ff5b99":"#5bb8ff", justifyContent: "center", alignItems: "center"}}>
                    <LineIcon name={"bubble"} size={12} color={"white"} family={"FontAwesome"} />
                  </View>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text numberOfLines={1} style={{paddingLeft: 1, fontSize: 15, textAlign: "center", color: "black", fontFamily: "Raleway-Regular"}}>{this.props.name}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default MatchListItem;
