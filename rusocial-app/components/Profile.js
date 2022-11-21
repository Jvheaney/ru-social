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

import FastImage from 'react-native-fast-image';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

var allowReportClick = true;
var allowBlockClick = true;

import navlogo from '../assets/images/NBF.png';

class Swipe extends Component {

  state = {
    reportUserDialog: false,
    reportUserMessage: "",
    reportUserDialogSubmitted: false,
    picture1Loading: false,
    picture2Loading: false,
    picture3Loading: false,
    picture0Loading: false,
    allowReportClick: true
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
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
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
        {(this.props.preview)?<View style={{backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={25} color="black" /></TouchableOpacity>
          {(!this.props.fromMatchConvo)?<Text style={{fontSize: 30, textAlign: "center", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Profile</Text>:<Text style={{fontSize: 30, textAlign: "center", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Match</Text>}
          <View style={{height: 50, width: 50}}></View>
        </View>:<View></View>}
        <ScrollView style={{height: '100%', width: '100%'}}>
          <View style={{height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: 'white'}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => Actions.fullimage({image: this.props.picture0})} activeOpacity={0.8}>
              <ImageBackground onLoadStart={() => this.setState({picture0Loading: true})} onLoadEnd={() => this.setState({picture0Loading: false})} source={{uri: this.props.picture0}} style={{justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenHeight*.65, width: screenWidth}}>
                {(this.state.picture0Loading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
              </ImageBackground>
              {(false)?<View style={{position: "absolute", top: 0, right: 0, height: 'auto', width: 'auto', backgroundColor: "#1fb1ff", borderBottomLeftRadius: 10}}>
                <Text style={{color: "#fff", fontSize: 16, padding: 10, fontFamily: "Raleway-Regular"}}>Suggested</Text>
              </View>:<View></View>}
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)']} style={{position: "absolute", bottom: 0}}>
                <View style={{paddingTop: 40, width: '100%', height: 'auto', flexDirection: 'row'}}>
                  <Text style={{color: "#ff5b99", fontSize: 35, left: 10, top: 5, fontFamily: "Raleway-Bold"}}>{this.props.username}</Text>
                  <View style={{height: '100%', width: '100%', position: 'relative'}}>
                    <View style={{left: 15, height: 6, width: 6, borderRadius: 3, backgroundColor: "#fff", position: 'absolute', bottom: 7}}></View>
                    <Text style={{paddingLeft: 25, color: "#fff", fontSize: 18, position: 'absolute', bottom: 0, fontFamily: "Raleway-Light"}}>{this.getAge()}</Text>
                  </View>
                </View>
                <Text style={{color: "#fff", fontSize: 18, left: 10, top: 5, paddingBottom: 5, fontFamily: "Raleway-Regular"}}>{this.props.program}, {this.props.year}</Text>
                {(this.props.lookingFor == "Let's see what happens")?
                <Text style={{color: "#fff", fontSize: 16, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.props.pronouns}, {this.props.lookingFor}</Text>
                :
                <Text style={{color: "#fff", fontSize: 16, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.props.pronouns}, Looking for {this.props.lookingFor}</Text>
                }
              </LinearGradient>
            </TouchableOpacity>
            {(false)?<View style={{height: "auto", width: screenWidth, backgroundColor: "#1fb1ff"}}>
              <Text style={{color: "#fff", fontSize: 16, padding: 10, fontFamily: "Raleway-Regular"}}></Text>
            </View>:<View></View>}
            {(this.props.bio.length > 0)?
            <View style={{height: 'auto', minHeight: screenWidth*0.15, width: screenWidth}}>
              {(Platform.OS == "ios")?<Text style={{position: "absolute", color: "rgba(255, 91, 153,0.25)", left: 0, top: 0, fontSize: 80, fontFamily: "Raleway-Regular"}}>❝</Text>
              :<Icon name="quote-left" size={45} style={{position: "absolute", padding: 5, left: 0, top: 0}} color="rgba(255, 91, 153,0.15)" />}
              <View style={{padding: 20, justifyContent: "center"}}>
                <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Regular"}}>{this.props.bio}</Text>
              </View>
              {(Platform.OS == "ios")?<Text style={{position: "absolute", color: "rgba(255, 91, 153,0.25)", right: 0, bottom: -35, fontSize: 80, fontFamily: "Raleway-Regular"}}>❞</Text>
              :<Icon name="quote-right"  style={{padding: 5, position: "absolute", right: 0, bottom: -0}} size={45} color="rgba(255, 91, 153,0.15)" />}
            </View>:<View></View>}
            {(this.props.picture1 != "")?<View style={{padding: 5}}><View style={{height: screenWidth-10, width: screenWidth-10, flexDirection: 'row', borderRadius: 10}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => Actions.fullimage({image: this.props.picture1})} activeOpacity={0.8}>
              <FastImage onLoadStart={() => this.setState({picture1Loading: true})} onLoadEnd={() => this.setState({picture1Loading: false})} source={{uri: this.props.picture1, priority: FastImage.priority.normal}} style={{borderRadius: 10,justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenWidth-10, width: screenWidth-10}}>
                {(this.state.picture1Loading)?<ActivityIndicator size="small" color="#ff5b99" />:<View></View>}
                {(this.props.caption0 && this.props.caption0.length > 0)?
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)', '#000']} style={{position: "absolute", bottom: 0}}>
                  <View style={{justifyContent: "center", height: 'auto', width: screenWidth-10}}>
                    <Text style={{padding: 10, paddingTop:30, textAlign: 'center', fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>{this.props.caption0}</Text>
                  </View>
                </LinearGradient>:<View></View>}
              </FastImage>
            </TouchableOpacity>
            </View></View>:<View></View>}
            {(this.props.picture2 != "")?<View style={{padding: 5}}><View style={{height: screenWidth-10, width: screenWidth-10, flexDirection: 'row', borderRadius: 10}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => Actions.fullimage({image: this.props.picture2})} activeOpacity={0.8}>
              <FastImage onLoadStart={() => this.setState({picture1Loading: true})} onLoadEnd={() => this.setState({picture1Loading: false})} source={{uri: this.props.picture2, priority: FastImage.priority.normal}} style={{borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenWidth-10, width: screenWidth-10}}>
                {(this.state.picture2Loading)?<ActivityIndicator size="small" color="#ff5b99" />:<View></View>}
                {(this.props.caption1 && this.props.caption1.length > 0)?
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)', '#000']} style={{position: "absolute", bottom: 0}}>
                  <View style={{justifyContent: "center", height: 'auto', width: screenWidth-10}}>
                    <Text style={{padding: 10, paddingTop:30, textAlign: 'center', fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>{this.props.caption1}</Text>
                  </View>
                </LinearGradient>:<View></View>}
              </FastImage>
            </TouchableOpacity>
          </View></View>:<View></View>}
            {(this.props.picture3 != "")?<View style={{padding: 5}}><View style={{height: screenWidth-10, width: screenWidth-10, flexDirection: 'row', borderRadius: 10}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => Actions.fullimage({image: this.props.picture3})} activeOpacity={0.8}>
              <FastImage onLoadStart={() => this.setState({picture1Loading: true})} onLoadEnd={() => this.setState({picture1Loading: false})} source={{uri: this.props.picture3, priority: FastImage.priority.normal}} style={{borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenWidth-10, width: screenWidth-10}}>
                {(this.state.picture3Loading)?<ActivityIndicator size="small" color="#ff5b99" />:<View></View>}
                <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={{position: "absolute", top: 0, height: 50, width: screenWidth}}>
                </LinearGradient>
                {(this.props.caption2 && this.props.caption2.length > 0)?
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)', '#000']} style={{position: "absolute", bottom: 0}}>
                  <View style={{justifyContent: "center", height: 'auto', width: screenWidth-10}}>
                    <Text style={{padding: 10, paddingTop:30, textAlign: 'center', fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>{this.props.caption2}</Text>
                  </View>
                </LinearGradient>:<View></View>}
              </FastImage>
            </TouchableOpacity>
          </View></View>:<View></View>}
            {(this.props.preview)?<View></View>:
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.reportDialog()}
                style={{paddingTop: 20, flexDirection: "row", height: 50, width: screenWidth, justifyContent: "center", alignItems: "center"}}>
                <LineIcon style={{}} name="exclamation" size={25} color="red" />
                <Text style={{fontSize: 20, fontFamily: "Raleway-Medium", color: "red"}}> Report or Block {this.props.username}</Text>
              </TouchableOpacity>}
            <View style={{height: 20, width: screenWidth}}></View>
          </View>
          <View style={{height: 100, width: screenWidth}}></View>
        </ScrollView>
        {(!this.props.preview)?<View pointerEvents={"box-none"} style={{width: screenWidth, justifyContent: 'center', flexDirection: "row", position: 'absolute', bottom: 10}}>
          <View style={{paddingRight: 10, justifyContent: 'flex-end'}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.onUndo()} style={{height: 60, width: 60, borderRadius: 35, backgroundColor: "rgba(255, 186, 82, 1)", justifyContent: "center", alignItems: "center"}}>
              <Icon name="undo" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.onSwipeRight()} style={{height: 70, width: 70, borderRadius: 35, backgroundColor: "rgba(255, 91, 153, 1)", justifyContent: "center", alignItems: "center"}}>
            <Icon name="heart" size={30} color="white" />
          </TouchableOpacity>
          <View style={{paddingLeft: 10, justifyContent: 'flex-end'}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.onSwipeLeft()} style={{height: 60, width: 60, borderRadius: 30, backgroundColor: "rgba(255, 91, 91, 1)", justifyContent: "center", alignItems: "center"}}>
            <Icon name="times" size={25} color="white" />
          </TouchableOpacity>
          </View>
        </View>
        :<View></View>}
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
            <Dialog.Container visible={this.state.reportUserDialogSubmitted}>
              <Dialog.Title>Report Submitted</Dialog.Title>
              <Dialog.Description>
                Thanks for your report! We are going to look into it.
              </Dialog.Description>
              <Dialog.Button onPress={() => this.setState({reportUserDialogSubmitted: false})} label="Close" />
              <Dialog.Button onPress={() => {this.setState({reportUserDialogSubmitted: false}); this.blockUser()}} label="Block User" />
            </Dialog.Container>
          </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
