import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL from '../global.js';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import FastImage from 'react-native-fast-image';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

var allowReportClick = true;
var allowBlockClick = true;

import navlogo from '../assets/images/NBF.png';

const feedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

class Swipe extends Component {

  state = {
    reportUserDialog: false,
    reportUserMessage: "",
    reportUserDialogSubmitted: false,
    pictureLoading: false,
    allowReportClick: true,
    imageIndex: 0
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if(nextProps.userid != this.props.userid){
      this.setState({
        imageIndex: 0
      })
    }
  }

  reportDialog = () => {
      this.setState({
        reportUserDialog: true
      })
  }

  _cancelReport = () => {
    this.setState({
      reportUserDialog: false
    })
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
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

  blockUser = () => {
    if(allowBlockClick){
      allowBlockClick = false;
      var details = {
        "token": GLOBAL.authToken,
        "blockedid": this.props.userid,
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/r/b', {
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
            alert("There was an error submitting your report.");
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            this.onSwipeLeft();
          }
        })
      .catch((error) => {
        allowBlockClick = true;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  _handleReportText = (message) => {
    this.setState({
      reportUserMessage: message
    })
  }

  getAge = () => {
    var date1 = new Date(this.props.birthdate);
    var date2 = new Date();
    var diffTime = Math.abs(date2 - date1);
    var diff = Math.floor(diffTime / (1000 * 60 * 60 * 24) / 365);
    return diff;
  }


  onSwipeLeft = (gestureState) => {
    if(!this.props.preview && this.props.allowClick){
      this.props.pass.setState({
        allowClick: false
      });
      var details = {
        "token": GLOBAL.authToken,
        "swipeid": this.props.userid,
        "liked": false
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/t/s', {
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
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var arr = this.props.pass.state.tuser;
            arr.shift();
            if(arr.length < 1){
              this.props.pass.getTimeline();
            }
            this.props.pass.setState({
              tuser: arr,
              allowClick: true,
              previousUserid: this.props.userid
            }, () =>
            this.props.renderNextFunc());
          }
      })
      .catch((error) => {
        this.props.pass.setState({
          allowClick: true
        });
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  onSwipeRight = (gestureState) => {
    if(!this.props.preview && this.props.allowClick){
      this.props.pass.setState({
        allowClick: false
      })
      var details = {
        "token": GLOBAL.authToken,
        "swipeid": this.props.userid,
        "liked": true
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/t/s', {
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
              this.props.pass.setState({
                allowClick: true
              });
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var previousUID = "";
            if(responseJson.status != "success"){
              this.props.whenMatch(responseJson.status);
            }
            else{
              previousUID = this.props.userid;
            }
            var arr = this.props.pass.state.tuser;
            arr.shift();
            if(arr.length < 1){
              this.props.pass.getTimeline();
            }
            this.props.pass.setState({
              tuser: arr,
              allowClick: true,
              previousUserid: previousUID
            }, () =>
            this.props.renderNextFunc());
          }
      })
      .catch((error) => {
        this.props.pass.setState({
          allowClick: true
        });
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  onUndo = () => {
    if(!this.props.preview && this.props.allowClick && this.props.pass.state.previousUserid != ""){
      this.props.pass.setState({
        allowClick: false
      });
      var arr = this.props.pass.state.tuser;
      arr.unshift(this.props.pass.state.previousUserid);
      this.props.pass.setState({
        tuser: arr,
        allowClick: true,
        previousUserid: ""
      },() => this.props.renderNextFunc());
    }
  }

  decreaseImageIndex = () => {
    if(this.state.imageIndex > 0){
      ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions);
      this.setState({
        imageIndex: this.state.imageIndex - 1
      })
    }
    else{
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
    }
  }

  increaseImageIndex = () => {
    if(this.state.imageIndex < this.props.images.length-1){
      ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions);
      this.setState({
        imageIndex: this.state.imageIndex + 1
      })
    }
    else{
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
    }
  }

  renderImageBars = () => {
    var imageBars = [];
    for(var i = 0; i<this.props.images.length; i++){
      imageBars.push(<View style={{margin: 5, borderRadius: 5, height: 5, width: (screenWidth/(this.props.images.length))*0.8, backgroundColor: (this.state.imageIndex == i)?"white":"rgba(0,0,0,0.5)"}}></View>)
    }

    return imageBars;
  }

  render() {
    console.disableYellowBox = true;
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 100,
      detectSwipeUp: false,
      detectSwipeDown: false,
    };

    return (
      //
        <View style={{height: '100%', width: '100%'}}>
          <View style={{height: 'auto', width: '100%', backgroundColor: 'black'}}>
              <FastImage onLoadStart={() => this.setState({pictureLoading: true})} onLoadEnd={() => this.setState({pictureLoading: false})} source={{uri: "https://rumine.ca/_i/s/i.php?i=" + this.props.images[this.state.imageIndex], priority: FastImage.priority.high}} style={{justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: '100%', width: '100%'}}>
                {(this.state.pictureLoading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
              </FastImage>
              <View style={{position: "absolute", top: 0, height: 15, width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center"}}>{this.renderImageBars()}</View>
              {(false)?<View style={{position: "absolute", top: 0, right: 0, height: 'auto', width: 'auto', backgroundColor: "#1fb1ff", borderBottomLeftRadius: 10}}>
                <Text style={{color: "#fff", fontSize: 16, padding: 10, fontFamily: "Raleway-Regular"}}>Suggested</Text>
              </View>:<View></View>}
              <TouchableOpacity activeOpacity={1} onPress={() => this.decreaseImageIndex()} style={{position: "absolute", height: '100%', width: '30%'}}>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => this.props.openFullProfile()} style={{position: "absolute", left: '30%', height: '100%', width: '40%'}}>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => this.increaseImageIndex()} style={{position: "absolute", right: 0, height: '100%', width: '30%'}}>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => this.props.openFullProfile()} style={{position: "absolute", bottom: 0, height: 120, width: '100%'}}>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)']} style={{position: "absolute", bottom: 0, width: '100%'}}>
                  <View style={{paddingTop: 40, width: '100%', height: 'auto', flexDirection: 'row'}}>
                    <Text style={{color: "#ff5b99", fontSize: 35, left: 10, top: 5, fontFamily: "Raleway-Bold"}}>{this.props.username}</Text>
                    <View style={{height: '100%', width: '100%', position: 'relative'}}>
                      <View style={{left: 15, height: 6, width: 6, borderRadius: 3, backgroundColor: "#fff", position: 'absolute', bottom: 7}}></View>
                      <Text style={{paddingLeft: 25, color: "#fff", fontSize: 18, position: 'absolute', bottom: 0, fontFamily: "Raleway-Light"}}>{this.getAge()}</Text>
                    </View>
                  </View>
                  {(this.props.recently_online)?<Text style={{color: "#fff", fontSize: 15, left: 10, top: 5, paddingBottom: 5, fontFamily: "Raleway-Bold"}}>Recently Online</Text>:<View></View>}
                  <View style={{maxWidth: screenWidth*0.8}}>
                    <Text style={{color: "#fff", fontSize: 15, left: 10, top: 5, paddingBottom: 5, fontFamily: "Raleway-Regular"}}>{this.props.program}, {this.props.year}</Text>
                  </View>
                  {(this.props.lookingFor == "Let's see what happens")?
                  <Text style={{color: "#fff", fontSize: 12, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.props.pronouns}, {this.props.lookingFor}</Text>
                  :
                  <Text style={{color: "#fff", fontSize: 12, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.props.pronouns}, Looking for {this.props.lookingFor}</Text>
                  }
                  <View style={{height: 10, width: '100%'}}></View>
                </LinearGradient>
              </TouchableOpacity>

          </View>
        </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
