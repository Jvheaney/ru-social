import React, {Component} from 'react';
import { Keyboard, TouchableWithoutFeedback, AppState, SafeAreaView, Button, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL from '../global.js';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import RBSheet from "react-native-raw-bottom-sheet";
import FastImage from 'react-native-fast-image';
import {Clipboard} from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import cache from '../in_memory_cache.js';
import GLOBALassets from '../utilities/global';

import Angry from '../assets/svgs/angry-react.svg';
import Haha from '../assets/svgs/haha-react.svg';
import Love from '../assets/svgs/love-react.svg';
import Sad from '../assets/svgs/sad-react.svg';
import Wow from '../assets/svgs/wow-react.svg';


import * as encoding from 'text-encoding';
Object.assign(global, { WebSocket: require('websocket').w3cwebsocket });
var Stomp = require('@stomp/stompjs');
var SockJS = require('sockjs-client');

import UIButton from '../components/UIButton';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

var allowReportClick = true;
var allowUnmatchClick = true;
var allowBlockClick = true;

const feedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

function arrayUnique(array) {
    var filter = {};
    var filtered_array = [];
    for(var i = 0; i<array.length; i++){
      if(filter[array[i]._id]){
      }
      else{
        filter[array[i]._id] = true;
        filtered_array.push(array[i]);
      }
    }

    return filtered_array;
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

let uniqid = makeid(5);

let client;

let openReactionMessageId = -1;
let openReactionGuid = -1;

let reactionToID = {};

class Swipe extends Component {

  constructor(props){
    super(props);
    this.references = {};
    this.references_measure = {};
    this.measurements = {};
    this.reactions_to_render = {};
  }

  connectStomp = () => {
    if(this.props.matchid != "system"){
    const stompConfig = {
        reconnectDelay: 1000,
        heartbeatIncoming: 0,
        heartbeatOutgoing: 0,
        connectHeaders: {
          "authtoken": GLOBAL.authToken
        }
    }

    stompConfig.webSocketFactory = () => {
      return new SockJS(
          "https://rumine.ca/_apiws/mws"
      );
    };
    client = new Stomp.Client(stompConfig);
    var matchid = this.props.matchid;
    var pass = this;
    client.onConnect = function(frame) {
      pass.setState({
        websocketFail: false
      })
      var headers = {'authtoken': GLOBAL.authToken};
      var subscription = client.subscribe("/mt/t/" + matchid, function(message) {
          // called when the client receives a STOMP message from the server
          var dataFromServer = JSON.parse(message.body);
          if(dataFromServer.token != uniqid && dataFromServer.react == null){
            if(dataFromServer.type == 2){
              var messageToAppend = {
                "_id": dataFromServer.message_id,
                "text":dataFromServer.msg,
                "user":{"_id":dataFromServer.senderid, "avatar": dataFromServer.avatar, "name": dataFromServer.name},
                "createdAt": Date(),
                "guid": dataFromServer.guid
              };
              var arr = pass.state.messages.slice(0);
              arr.unshift(messageToAppend);
              pass.setState(previousState => ({
                messages: arrayUnique(arr),
                messagePage: previousState.messagePage++
              }))
              const testData = {
                "matchid": matchid,
                "message_id": ""
              }
              testData.message_id = dataFromServer.message_id;
              try {
                client.publish({destination: '/sm/mr/' + matchid, headers: {"authtoken": GLOBAL.authToken } ,body: JSON.stringify(testData)});
              }
              catch(e){

              }
            }
            else{
              var messageToAppend = {
                "_id": dataFromServer.message_id,
                "text":dataFromServer.msg,
                "user":{"_id":"1"},
                "createdAt": Date(),
                "guid": dataFromServer.guid
              };
              var arr = pass.state.messages.slice(0);
              arr.unshift(messageToAppend);
              pass.setState(previousState => ({
                messages: arrayUnique(arr),
                messagePage: previousState.messagePage++
              }))
              const testData = {
                "matchid": matchid,
                "message_id": ""
              }
              testData.message_id = dataFromServer.message_id;
              try {
                client.publish({destination: '/sm/mr/' + matchid, headers: {"authtoken": GLOBAL.authToken } ,body: JSON.stringify(testData)});
              }
              catch(e){

              }
            }
          }
          else if(dataFromServer.token != uniqid && dataFromServer.react != null){
            if(pass.references[dataFromServer.message_id] == undefined){
              try {
                pass.references[dataFromServer.guid].setState({
                  react: dataFromServer.react
                })
              }
              catch(e){
              }

              if(dataFromServer.message_id != undefined && dataFromServer.message_id != -1){
                reactionToID[dataFromServer.message_id] = dataFromServer.react;
              }
              if(dataFromServer.guid != undefined && dataFromServer.guid != -1){
                reactionToID[dataFromServer.guid] = dataFromServer.react;
              }
            }
            else{
              try{
                pass.references[dataFromServer.message_id].setState({
                  react: dataFromServer.react
                })
                reactionToID[dataFromServer.message_id] = dataFromServer.react;
              }
              catch(e){
              }
            }
          }
          else{
          }
        }, headers);
    };

    client.onStompError = function(frame) {
      pass.setState({
        websocketFail: true
      })
    };
    client.activate();
  }
  }

  getConversation = (num) => {
    var pass = this;
    var details = {
      "token": GLOBAL.authToken,
      "matchid": this.props.matchid
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/m/c/' + num, {
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
          alert("There was an error fetching your conversation.");
          Actions.pop()
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          var dataToAppend = responseJson.data;
          for (var i = 0; i<dataToAppend.length; i++){
            if(dataToAppend[i].user._id == "1"){
              dataToAppend[i].user.avatar = (this.props.avatar.indexOf("https://rumine.ca") != -1)?{uri: this.props.avatar, priority: FastImage.priority.normal}:GLOBALassets.main[this.props.avatar];
            }
          }
          if(num == 0){
            if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
              cache.in_memory_cache = {};
            }
            if(cache.in_memory_cache['conversations'] == undefined){
              cache.in_memory_cache['conversations'] = {};
            }
            if(cache.in_memory_cache['conversations'][this.props.matchid] == undefined){
              cache.in_memory_cache['conversations'][this.props.matchid] = {};
            }
            cache.in_memory_cache['conversations'][this.props.matchid].conversation = dataToAppend;
            cache.in_memory_cache['conversations'][this.props.matchid].fetched = Math.round((new Date()).getTime()/1000);
            var firstTimeBool = false;
            if(num == 0 && dataToAppend.length == 0){
              firstTimeBool = true;
            }
            pass.setState({
              messages: dataToAppend,
              lastLength: dataToAppend.length,
              messagePage: dataToAppend.length,
              firstTimeChatting: firstTimeBool
            })
          }else{
            //var arrApp = this.state.messages.concat(dataToAppend);
            this.setState(previousState => ({
              messages: arrayUnique(previousState.messages.concat(dataToAppend)),
              lastLength: dataToAppend.length,
              messagePage: previousState.messagePage + dataToAppend.length
            }))
          }
        }

    })
    .catch((error) => {
    });
  }

  getGroupConversation = (num) => {
    var pass = this;
    var details = {
      "token": GLOBAL.authToken,
      "matchid": this.props.matchid
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/m/gc/' + num, {
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
          alert("There was an error fetching your conversation.");
          Actions.pop()
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          var dataToAppend = responseJson.data;
          if(num == 0){
            if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
              cache.in_memory_cache = {};
            }
            if(cache.in_memory_cache['conversations'] == undefined){
              cache.in_memory_cache['conversations'] = {};
            }
            if(cache.in_memory_cache['conversations'][this.props.matchid] == undefined){
              cache.in_memory_cache['conversations'][this.props.matchid] = {};
            }
            cache.in_memory_cache['conversations'][this.props.matchid].conversation = dataToAppend;
            cache.in_memory_cache['conversations'][this.props.matchid].fetched = Math.round((new Date()).getTime()/1000);
            pass.setState({
              messages: dataToAppend,
              lastLength: dataToAppend.length,
              messagePage: dataToAppend.length
            })
          }else{
            //var arrApp = this.state.messages.concat(dataToAppend);
            this.setState(previousState => ({
              messages: arrayUnique(previousState.messages.concat(dataToAppend)),
              lastLength: dataToAppend.length,
              messagePage: previousState.messagePage + dataToAppend.length
            }))
          }
        }

    })
    .catch((error) => {
      console.log(error);
    });
  }




  state = {
    reactionMenuIsOpen: false,
    messages: (cache.in_memory_cache && cache.in_memory_cache['conversations'] && cache.in_memory_cache['conversations'][this.props.matchid])?cache.in_memory_cache['conversations'][this.props.matchid].conversation:[],
    unmatchUserDialog: false,
    reportUserDialog: false,
    reportUserMessage: "",
    messagePage: 0,
    lastLength: 0,
    reportUserDialogSubmitted: false,
    websocketFail: false,
    prevState: 'active',
    firstTimeChatting: false
  }

  componentWillUnmount(){
    if(this.props.matchid != "system"){
      client.deactivate();
    }
    setTimeout(function() {Actions.refresh({refresh: true})}, 500);
    openReactionMessageId = -1;
    openReactionGuid = -1;
    reactionToID = {};
  }

  _handleAppStateChange = (nextAppState) => {
   if (nextAppState === 'background' || nextAppState === 'inactive') {
     this.setState({
       prevState: 'background'
     });
   }
   else if (nextAppState === 'active') {
     if(this.state.prevState !== 'active'){
       this.setState({
         prevState: 'active'
       });
       if(this.props._type == 2){
         this.getGroupConversation(0);
       }
       else{
         this.getConversation(0);
       }
       openReactionMessageId = -1;
       openReactionGuid = -1;
       reactionToID = {};
     }
   }
 };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    if(this.props._type == 2){
      this.getGroupConversation(0);
    }
    else{
      this.getConversation(0);
    }
    this.connectStomp();
    this.setState({
      messages: [
      ],
    })
  }

  onSend(messages = []) {
    if(this.props.matchid != "system"){
      var nameToSend = "";
      if(this.props._type == 2){
        if(GLOBAL.friends.lastname == undefined || GLOBAL.friends.lastname == null || GLOBAL.friends.lastname == ""){
          name = GLOBAL.friends.firstname_display;
        }
        else{
          name = GLOBAL.friends.firstname_display + " " + GLOBAL.friends.lastname;
        }
      }
      else if(this.props._type == 1){
          name = GLOBAL.friends.firstname_display;
      }
      else{
        name = GLOBAL.profile.firstname_display;
      }
      const testData = {
        "token" : uniqid,
        "matchid": this.props.matchid,
        "msg": messages[0].text,
        "guid": messages[0]._id,
        "type": this.props._type,
        "avatar": (this.props._type == 2)?GLOBAL.friends.image0:"",
        "name": name
      }
      try {
        client.publish({destination: '/sm/m/' + this.props.matchid, headers: {"authtoken": GLOBAL.authToken } ,body: JSON.stringify(testData)});
      }
      catch(e){
        alert("There was an error sending this message. Please try again later.");
        return;
      }
      var arr = this.state.messages;
      arr.unshift(messages[0]);
      if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
        cache.in_memory_cache = {};
      }
      if(cache.in_memory_cache['conversations'] == undefined){
        cache.in_memory_cache['conversations'] = {};
      }
      if(cache.in_memory_cache['conversations'][this.props.matchid] == undefined){
        cache.in_memory_cache['conversations'][this.props.matchid] = {};
      }
      cache.in_memory_cache['conversations'][this.props.matchid].conversation = arrayUnique(arr);
      cache.in_memory_cache['conversations'][this.props.matchid].fetched = Math.round((new Date()).getTime()/1000);
      this.setState(previousState => ({
        messages: arrayUnique(arr),
        messagePage: previousState.messagePage++,
        firstTimeChatting: false
      }))
    }
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  unmatchDialog = () => {
    this.RBSheet.close()
    setTimeout(() => {
      this.setState({
        unmatchUserDialog: true
      })
    }, 500);
  }

  unfriendDialog = () => {
    this.RBSheet.close()
    setTimeout(() => {
      this.setState({
        unfriendUserDialog: true
      })
    }, 500);
  }

  reportDialog = () => {
    this.RBSheet.close()
    setTimeout(() => {
      this.setState({
        reportUserDialog: true
      })
    }, 500);
  }

  safetyResources = () => {
    this.RBSheet.close()
    setTimeout(() => {
      Actions.safetyResources();
    }, 500);
  }

  _unfriend = () => {
    this.setState({
      unfriendUserDialog: false
    })
    if(allowUnmatchClick){
      allowUnmatchClick = false;
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


      return fetch('https://rumine.ca/_apiv2/gw/ft/uf', {
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
            alert("We could not unfriend this user. Please try again later.");
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowUnmatchClick = true;
            Actions.pop();
          }
        })
        .catch((error) => {
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
    }
  }

  _unmatch = () => {
    if(allowUnmatchClick){
      allowUnmatchClick = false;
    this.setState({
      unmatchUserDialog: false
    })
    var details = {
      "token": GLOBAL.authToken,
      "matchid": this.props.matchid,
      "userid": this.props.userid
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/m/un', {
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
          allowUnmatchClick = true;
          alert("There was an error unmatching this user.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          allowUnmatchClick = true;
          Actions.pop();
        }
    })
    .catch((error) => {
      allowUnmatchClick = true;
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }
  }

  _cancelUnmatch = () => {
    this.setState({
      unmatchUserDialog: false
    })
  }

  _cancelUnfriend = () => {
    this.setState({
      unfriendUserDialog: false
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

  blockUser = () => {
    if(this.props._type == 0){
      this._unmatch()
    }
    else{
      this._block();
    }
  }

  _report = () => {
    if(allowReportClick && this.state.reportUserMessage != ""){
    allowReportClick = false;
    var details = {
      "token": GLOBAL.authToken,
      "message": this.cleanSmartPunctuation(this.state.reportUserMessage),
      "reported_matchid": this.props.matchid,
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/r/m', {
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
          }, 1000);
      }
    })
    .catch((error) => {
      allowReportClick = true;
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }
  }

  _handleReportText = (message) => {
    this.setState({
      reportUserMessage: message
    })
  }

  onLoadEarlier = () => {
    if(this.state.lastLength == 25){
      if(this.props._type == 2){
        this.getGroupConversation(this.state.messages.length);
      }
      else{
        this.getConversation(this.state.messages.length);
      }
      this.setState({
        messagePage: this.state.messagePage+1
      });
    }
  }

  hasSelectedAMessage = () => {
    if(openReactionMessageId != -1 && openReactionGuid != -1){
      return false;
    }
    return true;
  }

  dismissCopyMessage = () => {
    this.passDismissalToOpenReactions();
  }

  copyMessage = () => {
    var message = this.references[openReactionMessageId].props.currentMessage.text;
    Clipboard.setString(message);
    ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
    this.setState({
      reactionMenuIsOpen: false
    })
    this.setState({
      copiedMessage: true
    });
    var pass = this;
    setTimeout(function() {
      pass.setState({
        copiedMessage: false
      });
    }, 3000)
  }

  setCurrentMessageForOpenReactions = (id, guid) => {
    ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
    openReactionMessageId = id;
    openReactionGuid = guid;

    this.setState({
      reactionMenuIsOpen: true,
      reactionMenuDrawX: ((this.measurements[openReactionMessageId].width-200)<this.measurements[openReactionMessageId].x)?this.measurements[openReactionMessageId].x:this.measurements[openReactionMessageId].width-200,
      reactionMenuDrawY: this.measurements[openReactionMessageId].y-(55+getBottomSpace())
    })
  }

  passDismissalToOpenReactions = () => {
    this.setState({
      reactionMenuIsOpen: false
    })
    if(openReactionMessageId != -1){
      if(this.references[openReactionMessageId] === undefined){
        openReactionMessageId = -1;
        openReactionGuid = -1;
        return 0;
      }
      this.references[openReactionMessageId].dismissReactionMenu();
      openReactionMessageId = -1;
      openReactionGuid = -1;
    }
  }

  trimName = (name) => {
    return name.trim();
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
            allowBlockClick = true;
            Actions.pop();
          }
        })
      .catch((error) => {
        allowBlockClick = true;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  renderBubble = (props) => {
    return ( <View
       ref={(view) => {
        this.references_measure[props.currentMessage._id] = view;
      }}
      onLayout={({nativeEvent}) => {
        if (this.references_measure[props.currentMessage._id]) {
          this.references_measure[props.currentMessage._id].measureInWindow((x, y, width, height) => {
                this.measurements[props.currentMessage._id] = {x,y,width,height,position:props.position};
              })
            }
          }}
      style={{maxWidth: screenWidth*0.85}}>
      {(this.props._type == 2 && props.currentMessage.user._id != "0" && (props.previousMessage.user == undefined || props.previousMessage.user._id != props.currentMessage.user._id))?
        <Text style={{marginLeft: 5, marginBottom: 1, color: "gray", fontSize: 10, fontFamily: "Raleway-Medium"}}>{props.currentMessage.user.name}</Text>
        :
      <View></View>}
      <Bubble {...props}
      allowReactions={!(this.props._type == 2)}
      onRef={(ref) => {
        this.references[props.currentMessage._id] = ref;
      }}
      pass={this}
      reaction={(this.reactions_to_render[props.currentMessage._id]!== undefined)?this.reactions_to_render[props.currentMessage._id]:(props.currentMessage.react !== undefined)?props.currentMessage.react:(reactionToID[props.currentMessage._id] !== undefined)?reactionToID[props.currentMessage._id]:reactionToID[props.currentMessage.guid]}
      wrapperStyle={{
          left: {
            backgroundColor: '#e3e3e3',
          },
          right: {
            backgroundColor: (this.props._type == 2)?"#6970ff":(this.props._type == 1)?'#5bb8ff':"#ff87b5"
          }
        }} />
      </View> ) }

  renderCachedAvatar = (props) => {
    if(this.props._type == 2){
      return (<TouchableOpacity activeOpacity={0.7}
        onPress={() => Actions.previewprofile({fromFriendsConvo: true, fromMatchConvo: false, userid: props.currentMessage.user._id})}
        style={{borderRadius: 13, height: 25, width: 25, overflow: "hidden", borderColor: "#fff", borderWidth: 0.2}}>
            <FastImage source={{uri: "https://rumine.ca/_i/s/i.php?i=" + props.currentMessage.user.avatar, priority: FastImage.priority.normal}}
              style={{height: 25, width: 25}}>
            </FastImage>
        </TouchableOpacity>);
    }
    else{
      return (<TouchableOpacity activeOpacity={0.7}
        onPress={() => Actions.previewprofile({fromFriendsConvo: (this.props._type==1), fromMatchConvo: (this.props._type==0), userid: this.props.userid})}
        style={{borderRadius: 13, height: 25, width: 25, overflow: "hidden", borderColor: "#fff", borderWidth: 0.2}}>
            <FastImage source={(this.props.avatar.indexOf("https://rumine.ca") != -1)?{uri: this.props.avatar, priority: FastImage.priority.normal}:GLOBALassets.main[this.props.avatar]}
              style={{height: 25, width: 25}}>
            </FastImage>
        </TouchableOpacity>);
    }
  }

  sendReactToBackend = (name) => {
    if(this.props.matchid != "system"){
      if(this.references[openReactionMessageId] != undefined && this.references[openReactionMessageId].state.react == name){
        name = "";
      }
      this.reactions_to_render[openReactionMessageId] = name;
      const testData = {
        "matchid": this.props.matchid,
        "message_id": "",
        "guid": "",
        "react": name,
        "token" : uniqid
      }
      testData.message_id = openReactionMessageId;
      testData.guid = openReactionGuid;
      if(openReactionMessageId != undefined && openReactionMessageId != -1){
        reactionToID[openReactionMessageId] = name;
      }
      if(openReactionGuid != undefined && openReactionGuid != -1){
        reactionToID[openReactionGuid] = name;
      }
      try {
        client.publish({destination: '/sm/rm/' + this.props.matchid, headers: {"authtoken": GLOBAL.authToken } ,body: JSON.stringify(testData)});
      }
      catch(e){

      }
      this.passDismissalToOpenReactions();
    }
  }

  render() {
    console.disableYellowBox = true;
    return (
      //
      <SafeAreaView style={{
        flex:1,
        backgroundColor: "white"
      }}>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{flex: 1, borderRadius: 20, backgroundColor: '#fafafa'}}>
          <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); this.passDismissalToOpenReactions()}}>
            <View style={{height: '100%', width: '100%'}}>
              <GiftedChat
                bottomOffset={getBottomSpace()}
                scrollEnabled={!this.state.reactionMenuIsOpen}
                pass={this}
                onLongPress={() => {}}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                alwaysShowSend={true}
                renderAvatar={(props) => this.renderCachedAvatar(props)}
                onPressAvatar={() => Actions.previewprofile({fromFriendsConvo: (this.props._type==1), fromMatchConvo: (this.props._type==0), userid: this.props.userid})}
                maxInputLength={1024}
                renderBubble={this.renderBubble}
                user={{
                  _id: "0",
                }}
                listViewProps={
                  {
                    onEndReached: this.onLoadEarlier.bind(this),
                    onEndReachedThreshold: 0.5,
                  }
                }
              />
            </View>
          </TouchableWithoutFeedback>
          {(this.state.copiedMessage)?<View pointerEvents="none" style={{position: 'absolute', height: '100%', width: '100%', top: 0, alignItems: "center"}}>
            <View style={{height: 40, width: 80, backgroundColor: 'white', borderRadius: 50, top: screenHeight*0.075, justifyContent: "center", alignItems: "center",  shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 2}}>
              <Text style={{color: "black", fontSize: 14, fontFamily: "Raleway-Medium"}}>Copied</Text>
            </View>
          </View>:<View></View>}
          {(this.state.reactionMenuIsOpen && this.measurements[openReactionMessageId] && this.measurements[openReactionMessageId].position != "right" && this.props._type != 2)?<View pointerEvents="box-none" style={{position: 'absolute', height: '100%', width: '100%', top: 0, alignItems: "center"}}>
            <View style={{height: 40, position: "absolute", width: 180, backgroundColor: "#fff", left: this.state.reactionMenuDrawX, top: this.state.reactionMenuDrawY, borderRadius: 20, shadowColor: '#000',
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 2}}>
              <View style={{height: '100%', width: '100%', flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReactToBackend("love")} style={{margin: 5}}><Love style={{height: 25, width: 25}} /></TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReactToBackend("haha")} style={{margin: 5}}><Haha style={{height: 25, width: 25}} /></TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReactToBackend("sad")} style={{margin: 5}}><Sad style={{height: 25, width: 25}} /></TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReactToBackend("wow")} style={{margin: 5}}><Wow style={{height: 25, width: 25}} /></TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReactToBackend("angry")} style={{margin: 5}}><Angry style={{height: 25, width: 25}} /></TouchableOpacity>
              </View>
            </View>
          </View>:<View></View>}
          {(this.state.websocketFail)?<View style={{position: "absolute", top: 50, height: 30, width: '100%', backgroundColor: "red", alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "white", fontSize: 18, fontFamily: "Raleway-Regular"}}>Connection Error</Text>
          </View>:<View></View>}
          {(this.state.firstTimeChatting)?<View style={{position: "absolute", top: 50, height: "auto", width: '100%', paddingLeft: 5, paddingRight: 5, backgroundColor: "#FCD12A", alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "black", fontSize: 16, padding: 5, fontFamily: "Raleway-Medium", textAlign: "center"}}>This is your first time chatting with {this.trimName(this.props.username)}.</Text>
            <Text style={{color: "black", fontSize: 14, padding: 3, paddingBottom: 10, fontFamily: "Raleway-Regular", textAlign: "center"}}>If you feel uncomfortable or need help at any time, you can access safety resources, {(this.props._type == 0)?"unmatch":"unfriend"}, report, and block {this.trimName(this.props.username)} using the dots at the top right.</Text>
          </View>:<View></View>}
          <View style={{height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "absolute", backgroundColor: "white"}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop({refresh: true})} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
              <FastImage source={(this.props.avatar.indexOf("https://rumine.ca") != -1)?{uri: this.props.avatar, priority: FastImage.priority.normal}:GLOBALassets.main[this.props.avatar]}
                style={{height: 40, width: 40, borderRadius: 20, borderWidth: 2, borderColor: (this.props._type == 2)?"#6970ff":(this.props._type == 1)?'#5bb8ff':"#ff87b5"}}>
              </FastImage>
              {(this.props._type == 2)?
                (this.props.fromGroupTimeline)?
                <View style={{flexDirection: "row", paddingLeft: 10, height: 50, width: 'auto', alignItems: "center", maxWidth: '70%'}}><Text numberOfLines={1} style={{color: "black", fontSize: 18, fontFamily: "Raleway-Bold"}}>{this.props.username}</Text></View>
                :
                <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.groupTimeline({fromGroupChat: true, image: this.props.avatar, groupid: this.props.userid, groupName: this.props.username, isGroupAdmin: false, isPrivate: false, isMember: true})} style={{flexDirection: "row", paddingLeft: 10, height: 50, width: 'auto', alignItems: "center", maxWidth: '70%'}}><Text numberOfLines={1} style={{color: "black", fontSize: 18, fontFamily: "Raleway-Bold"}}>{this.props.username}</Text></TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.previewprofile({fromFriendsConvo: (this.props._type==1), fromMatchConvo: (this.props._type==0), userid: this.props.userid})} style={{flexDirection: "row", paddingLeft: 10, height: 50, width: 'auto', alignItems: "center", maxWidth: '70%'}}><Text numberOfLines={1} style={{color: "black", fontSize: 18, fontFamily: "Raleway-Bold"}}>{this.props.username}</Text></TouchableOpacity>
              }
            </View>
            {(this.props.fromGroupTimeline)?
              <View></View>
              :
              (this.props._type == 2)?
              <View></View>
              :
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.RBSheet.open()} style={{position: "absolute", right: 0, flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="options" size={20} color="black" /></TouchableOpacity>
            }
          </View>
          {(this.state.reactionMenuIsOpen)?<View style={{borderTopWidth: 0.5, borderColor: 'gray', height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "absolute", bottom: 0, backgroundColor: "white"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.copyMessage()} style={{flexDirection: "row", height: 50, paddingLeft: 20, width: 'auto', alignItems: "center"}}><Text style={{color: "blue", fontSize: 14, fontFamily: "Raleway-Medium"}}>Copy Message</Text></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.dismissCopyMessage()} style={{flexDirection: "row", height: 50, paddingRight: 20, width: 'auto', alignItems: "center"}}><Text style={{color: "gray", fontSize: 14, fontFamily: "Raleway-Medium"}}>Dismiss</Text></TouchableOpacity>
          </View>:<View></View>}
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={250}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(0,0,0,0.5)"
              },
              draggableIcon: {
                backgroundColor: "#000000"
              },
              container: {
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              },
            }}
          >
          <View style={{alignItems: "center"}}>
            {(this.props._type==0)?<TouchableOpacity activeOpacity={0.7} onPress={() => this.unmatchDialog()} style={{width: screenWidth*0.7, height: 60, backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
              <Text style={{color: "black", fontSize: 18, fontFamily: "Raleway-Medium"}}>Unmatch</Text>
              <LineIcon name="trash" size={20} color="gray" />
            </TouchableOpacity>
            :
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.unfriendDialog()} style={{width: screenWidth*0.7, height: 60, backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
              <Text style={{color: "black", fontSize: 18, fontFamily: "Raleway-Medium"}}>Unfriend</Text>
              <LineIcon name="trash" size={20} color="gray" />
            </TouchableOpacity>
            }
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.reportDialog()} style={{width: screenWidth*0.7, height: 60, backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
              <Text style={{color: "black", fontSize: 18, fontFamily: "Raleway-Medium"}}>Report/Block</Text>
              <LineIcon name="exclamation" size={20} color="red" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.safetyResources()} style={{width: screenWidth*0.7, height: 60, backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
              <Text style={{color: "black", fontSize: 18, fontFamily: "Raleway-Medium"}}>Safety Resources</Text>
              <LineIcon name="info" size={20} color="#FCD12A" />
            </TouchableOpacity>
          </View>
        </RBSheet>
        <View>
          <Dialog.Container visible={this.state.unmatchUserDialog}>
            <Dialog.Title>Unmatch {this.props.username}?</Dialog.Title>
            <Dialog.Description>
              {this.props.username} will no longer be able to send you messages. This cannot be undone.
            </Dialog.Description>
            <Dialog.Button onPress={() => this._cancelUnmatch()} label="Cancel" />
            <Dialog.Button onPress={() => this._unmatch()} label="Unmatch" />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.unfriendUserDialog}>
            <Dialog.Title>Unfriend {this.props.username}?</Dialog.Title>
            <Dialog.Description>
              {this.props.username} will no longer be able to send you messages. This cannot be undone.
            </Dialog.Description>
            <Dialog.Button onPress={() => this._cancelUnfriend()} label="Cancel" />
            <Dialog.Button onPress={() => this._unfriend()} label="Unfriend" />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.reportUserDialogSubmitted}>
            <Dialog.Title>Report Submitted</Dialog.Title>
            <Dialog.Description>
              Block this user if you don't want to receive messages from them.
            </Dialog.Description>
            <Dialog.Button onPress={() => this.setState({reportUserDialogSubmitted: false})} label="Close" />
            <Dialog.Button onPress={() => {this.setState({reportUserDialogSubmitted: false}); this.blockUser()}} label="Block User" />
          </Dialog.Container>
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
        </View>
      </View>
      </SafeAreaView>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
