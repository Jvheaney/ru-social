import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'

import GLOBAL from '../global.js';
import globalassets from '../utilities/global';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let allowStartConvo = true;
let addFriendCalled = false;


class MatchListItem extends Component {

  state = {
    areYouSure: false,
    friends: this.props.friends,
    requested: this.props.requested,
    loadingConvo: false
  }

  renderMessage = () => {
    if(this.props.message.length > 47){
      return this.props.message.substring(0,47) + "...";
    }
    else{
      return this.props.message
    }
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


    return fetch('https://rumine.ca/_apiv2/gw/ft/rsr', {
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
          alert("We could not remove your request. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          this.setState({
            requested: false
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  requestUser = () => {
    addFriendCalled = true;
    this.setState({
      requested: true
    });
    var pass = this;
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
    return fetch('https://rumine.ca/_apiv2/gw/ft/sfr', {
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
          addFriendCalled = true;
          this.setState({
            requested: false
          });
          alert("There was an error sending your friend request. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA" && responseJson.error == null){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(responseJson.status == "added"){
            addFriendCalled = true;
            this.setState({
              friends: true
            });
          }
        }
    })
    .catch((error) => {
      addFriendCalled = true;
      this.setState({
        requested: false
      });
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  startConvo = () => {
    this.setState({
      loadingConvo: true
    })
    if(allowStartConvo){
      allowStartConvo = false;
      var details = {
        "token": GLOBAL.authToken,
        "userid": this.props.userid,
        "type":1
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
            Actions.replace("matchConvo",{matchid: responseJson.data.matchid, userid: this.props.userid, _type:1, username: this.props.firstname_display, avatar:'https://rumine.ca/_i/s/i.php?i='+this.props.image})
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
          <TouchableOpacity activeOpacity={0.7} onPress={() => {if(this.props.type==0){Actions.previewprofile({allowReport: true, allowFriending: !(this.props.friends || this.props.requested), fromFriendsConvo: true, userid: this.props.userid})}else{Actions.groupTimeline({image: this.props.image, groupid: this.props.groupid, groupName: this.props.name, isGroupAdmin: this.props.isGroupAdmin, isPrivate: this.props.isPrivate, isMember: this.props.isMember})}}} style={{height: 60, paddingLeft: 20, paddingRight: 20, width: '100%', marginTop: 10, flexDirection: "row", alignItems: "center"}}>
          <View style={{flexDirection: "row", minWidth: 200, alignItems: "center"}}>
            <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: "gray", overflow: "hidden"}}>
              <FastImage borderRadius={25} source={(this.props.image && this.props.image.length == 4 && this.props.image.substring(0,3) == "def")?globalassets.main[this.props.image]:{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.image, priority: FastImage.priority.normal}} style={{height: 50, width: 50, borderRadius: 25, overflow: "hidden"}}></FastImage>
            </View>
            <View style={{flexDirection: "column", justifyContent: "center"}}>
              {(this.props.type == 0)?
              <Text style={{fontSize: 18, paddingLeft: 10, color: "black", fontFamily: "Raleway-Regular"}}>{this.props.firstname_display} {this.props.lastname}</Text>
              :
              <Text style={{fontSize: 18, paddingLeft: 10, color: "black", fontFamily: "Raleway-Regular"}}>{this.props.name}</Text>
              }
              {(this.state.friends)?
              <View style={{marginLeft: 10, backgroundColor: "#00B300", width: 50, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 12, color: "white", fontFamily: "Raleway-Regular"}}>Friends</Text>
              </View>
              :
              (this.props.type == 1 && this.props.isGroupAdmin)?
              <View style={{marginLeft: 10, backgroundColor: "#FFD700", width: 50, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 12, color: "black", fontFamily: "Raleway-Regular"}}>Admin</Text>
              </View>
              :
              (this.props.type == 1 && this.props.isMember)?
              <View style={{marginLeft: 10, backgroundColor: "#3aa14b", width: 60, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 12, color: "white", fontFamily: "Raleway-Regular"}}>Member</Text>
              </View>
              :
              (this.props.type == 1)?
              <View style={{marginLeft: 10, backgroundColor: "#6970ff", width: 50, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 12, color: "white", fontFamily: "Raleway-Regular"}}>Group</Text>
              </View>
              :
              (this.state.requested)?
              <View style={{marginLeft: 10, backgroundColor: "#FFD700", width: 70, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 12, color: "black", fontFamily: "Raleway-Regular"}}>Requested</Text>
              </View>
              :
              <View>
              </View>}
            </View>
          </View>
          {(this.props.type == 0)?
          <>
          {(this.state.friends)?
            (!this.state.loadingConvo)?<TouchableOpacity activeOpacity={0.7} onPress={() => this.startConvo()} style={{position: 'absolute', right: 15, height: 50, width: 50, justifyContent: "center", alignItems: "center"}}>
              <LineIcon name="bubble" size={20} color="black" />
            </TouchableOpacity>
            :
            <View style={{position: 'absolute', right: 15, height: 50, width: 50, justifyContent: "center", alignItems: "center"}}><ActivityIndicator size="small" color="black" /></View>
          :
          (this.state.requested)?
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({areYouSure: true})} style={{position: 'absolute', right: 15, height: 50, width: 50, justifyContent: "center", alignItems: "center"}}>
            <LineIcon name="trash" size={18} color="black" />
          </TouchableOpacity>
          :
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.requestUser()} style={{position: 'absolute', right: 15, height: 50, width: 50, justifyContent: "center", alignItems: "center"}}>
            <LineIcon name="user-follow" size={18} color="black" />
          </TouchableOpacity>}
          </>
          :
          <>
          <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.replace("groupTimeline",{groupid: this.props.groupid, groupName: this.props.name, isGroupAdmin: this.props.isGroupAdmin, isPrivate: this.props.isPrivate, isMember: this.props.isMember})} style={{position: 'absolute', right: 15, height: 50, width: 50, justifyContent: "center", alignItems: "center"}}>
            <LineIcon name="arrow-right" size={12} color="black" />
          </TouchableOpacity>
          </>}
          <View>
            <Dialog.Container visible={this.state.areYouSure}>
              <Dialog.Title>Cancel Request</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to cancel your friend request to {this.props.firstname_display}?
              </Dialog.Description>
              <Dialog.Button onPress={() => this.setState({areYouSure: false})} label="Cancel" />
              <Dialog.Button onPress={() => this.removeFriendRequest()} label="Yes" />
            </Dialog.Container>
          </View>
          </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default MatchListItem;
