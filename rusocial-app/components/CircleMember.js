import React, {Component} from 'react';
import { ActivityIndicator, Modal, SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import FastImage from 'react-native-fast-image'

import TitleText from '../elements/TitleText';

import { apiCall, imageURL } from '../utilities/Connector';
import GLOBAL from '../global';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let allowReportClick = true;
var allowBlockClick = true;
var allowStartConvo = true;

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';


class TextPost extends Component {

  state = {
    areYouSure: false,
    report_userid: "",
    report_username: "",
    reportUserDialog: false,
    reportUserMessage: "",
    reportUserDialogSubmitted: false,
    loadingConvo: false
  }

  _removeFromGroup = async() => {
    var formdata = new FormData();
    formdata.append("groupid", this.props.circleid);
    formdata.append("friend", this.props.userid);
    const groupMemberCall = await apiCall("/g/rf",formdata);
    this.setState({
      removeUserDialog: false
    })
    this.props.pass._refreshGroupMembers();
  }


    _report = () => {
      if(allowReportClick && this.state.reportUserMessage != ""){
        allowReportClick = false;
        var details = {
          "token": GLOBAL.authToken,
          "reported_userid": this.props.userid,
          "message": this.cleanSmartPunctuation(this.state.reportUserMessage)
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/r/u', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: formBody,
        }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson == "logout"){
              allowReportClick = true;
              Actions.replace("login");
            }
            else if(responseJson.status == "wrongdata"){
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              allowReportClick = true;
              alert("There was an error submitting your report.");
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              this.setState({
                reportUserDialog: false,
              })
              var pass = this;
              setTimeout(function() {
                pass.setState({
                  reportUserDialogSubmitted: true
                })
                allowReportClick = true;
              }, 500);
            }
          })
        .catch((error) => {
          allowReportClick = true;
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
    }

    _cancelReport = () => {
      this.setState({
        reportUserDialog: false
      })
    }

    _cancelRemove = () => {
      this.setState({
        removeUserDialog: false
      })
    }

    cleanSmartPunctuation = (value) => {
      return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
    }

    _handleReportText = (message) => {
      this.setState({
        reportUserMessage: message
      })
    }

    _block = () => {
      if(allowBlockClick){
        allowBlockClick = false;
        var details = {
          "token": GLOBAL.authToken,
          "userid": this.props.userid,
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/ft/bu', {
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
            else if(responseJson.status == "wrongdata"){
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              allowBlockClick = true;
              alert("There was an error blocking this user.");
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              this.props.pass._refreshGroupMembers();
            }
          })
        .catch((error) => {
          console.log(error);
          allowBlockClick = true;
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
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
      //
      <View style={{height: 60, paddingLeft: 20, paddingRight: 20, width: '100%', marginTop: 10, flexDirection: "row", alignItems: "center"}}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.previewprofile({fromFriendsConvo: true, userid: this.props.userid})} style={{flexDirection: "row", minWidth: 200, alignItems: "center"}}>
        <View style={{height: 40, width: 40, borderRadius: 25, backgroundColor: "gray"}}>
          <FastImage source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.avatar, priority: FastImage.priority.normal}} style={{height: 40, width: 40, borderRadius: 25}}></FastImage>
        </View>
        <Text numberOfLines={1} style={{fontSize: 15, maxWidth: '75%', paddingLeft: 10, color: "black", fontFamily: "Raleway-Regular"}}>{this.props.username}</Text>
      </TouchableOpacity>
      <View style={{flexDirection: "row", position: 'absolute', right: 25}}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({reportUserDialog: true})} style={{height: 50, width: 40, justifyContent: "center", alignItems: "center"}}>
          <LineIcon name="exclamation" size={20} color="red" />
        </TouchableOpacity>
        {(this.props.isGroupAdmin)?
        <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({removeUserDialog: true})} style={{height: 50, width: 40, justifyContent: "center", alignItems: "center"}}>
          <LineIcon name="trash" size={20} color="gray" />
        </TouchableOpacity>:<View></View>}
      </View>
      <View>
        <Dialog.Container visible={this.state.reportUserDialog}>
          <Dialog.Title>Report {this.props.username}</Dialog.Title>
          <Dialog.Description>
            Why are you reporting {this.props.username}?
          </Dialog.Description>
          <Dialog.Input
            placeholder="Reason"
            placeholderTextColor="#aaaaaa"
            style={{color: "black"}}
            multiline={true}
            onChangeText={(message) => this._handleReportText(message)}
            >
            </Dialog.Input>
            <Dialog.Button onPress={() => this._cancelReport()} label="Cancel" />
            <Dialog.Button onPress={() => this._report()} label="Report" />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.removeUserDialog}>
            <Dialog.Title>Remove {this.props.username}</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to remove {this.props.username} from your group?
            </Dialog.Description>
              <Dialog.Button onPress={() => this._cancelRemove()} label="Cancel" />
              <Dialog.Button onPress={() => this._removeFromGroup()} label="Yes" />
            </Dialog.Container>
          </View>
        <View>
          <Dialog.Container visible={this.state.reportUserDialogSubmitted}>
            <Dialog.Title>Report Submitted</Dialog.Title>
            <Dialog.Description>
              Thanks for your report! We are going to look into it.
            </Dialog.Description>
            <Dialog.Button onPress={() => this.setState({reportUserDialogSubmitted: false})} label="Close" />
            <Dialog.Button onPress={() => {this.setState({reportUserDialogSubmitted: false}); this._block()}} label="Block User" />
          </Dialog.Container>
        </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default TextPost;
