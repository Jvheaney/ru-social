import React, {Component} from 'react';
import { Clipboard, Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import GLOBAL from '../global.js';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-community/async-storage';
import {check, request, PERMISSIONS, RESULTS, checkNotifications, requestNotifications} from 'react-native-permissions';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import UIButtonSetting from '../components/UIButtonSetting';
import UIButton from '../components/UIButton';

import FastImage from 'react-native-fast-image'
import { Switch } from 'react-native-switch';

import navlogo from '../assets/images/NBF.png';
import Icon from 'react-native-vector-icons/FontAwesome'

var allowNotifToChange = GLOBAL.allowNotification;
var allowLocToChange = GLOBAL.allowLocation;

var allowProblemClick = true;
var allowSuggestionClick = true;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const feedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

class Swipe extends Component {

  state = {
    showCopied: false,
    myUserid: (GLOBAL.friends.userid)?GLOBAL.friends.userid:"",
    shareurl: (GLOBAL.shareurl)?GLOBAL.shareurl:"",
    reportProblemDialog: false,
    suggestionDialog: false,
    reportProblemMessage: "",
    suggestionMessage: "",
    myPicture: (GLOBAL.profile == undefined || GLOBAL.profile.image0 == undefined)?"":"https://rumine.ca/_i/s/i.php?i=" + GLOBAL.profile.image0,
    myFriendsPicture: (GLOBAL.friends == undefined || GLOBAL.friends.image0 == undefined)?"":"https://rumine.ca/_i/s/i.php?i=" + GLOBAL.friends.image0,
    notificationsEnabled: JSON.parse(GLOBAL.allowNotification),
    locationEnabled: JSON.parse(GLOBAL.allowLocation),
    reportProblemDialogSubmitted: false,
    suggestionDialogSubmitted: false,
    notifTapSlowDown: 0,
    notifTapSlowDownTime: "",
    locTapSlowDown: 0,
    locTapSlowDownTime: "",
    friendsEnableTapSlowDown: 0,
    friendsEnableTapSlowDownTime: "",
    datingEnableTapSlowDown: 0,
    datingEnableTapSlowDownTime: "",
    allowLocToChange: false,
    allowNotifToChange: false,
    datingEnabled: (GLOBAL.profile == undefined || GLOBAL.profile.show_me == undefined)?false:GLOBAL.profile.show_me,
    friendsEnabled: (GLOBAL.friends == undefined || GLOBAL.friends.show_me == undefined)?false:GLOBAL.friends.show_me,
    friendsProfileExists: (GLOBAL.friends == undefined || GLOBAL.friends.firstname_display == undefined)?false:true,
    datingProfileExists: (GLOBAL.profile == undefined || GLOBAL.profile.firstname_display == undefined)?false:true,
  }

  componentDidMount() {
  }

  componentWillUnmount(){
    if(GLOBAL.changedPref){
      GLOBAL.changedPref = false;
      setTimeout(function() {Actions.refresh({refresh: true})}, 500);
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

  checkPermissionsAndroid = async () => {
    const pa1 = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this._storeData("allowLocation", "false");
            this.setState({
              allowLocToChange: false
            });
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
              if(result == "granted"){
                this._storeData("allowLocation", "true");
                this.setState({
                  allowLocToChange: true
                });
              }
              else{
                this._storeData("allowLocation", "false");
                this.setState({
                  allowLocToChange: false
                });
              }
            });
            break;
          case RESULTS.GRANTED:
            this._storeData("allowLocation", "true");
            this.setState({
              allowLocToChange: true
            });
            break;
          case RESULTS.BLOCKED:
            this._storeData("allowLocation", "false");
            this.setState({
              allowLocToChange: false
            });
            break;
        }
      })
      .catch(error => {
      });
      const pa2 = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this._storeData("allowLocation", "false");
              allowLocToChange = false;
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.DENIED:
              request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
                if(result == "granted"){
                  this._storeData("allowLocation", "true");
                  allowLocToChange = true;
                }
                else{
                  this._storeData("allowLocation", "false");
                  allowLocToChange = false;
                }
              });
            case RESULTS.GRANTED:
              this._storeData("allowLocation", "true");
              allowLocToChange = true;
              GLOBAL.allowLocation = "true";
              break;
            case RESULTS.BLOCKED:
              this._storeData("allowLocation", "false");
              allowLocToChange = false;
              GLOBAL.allowLocation = "false";
              break;
          }
        })
        .catch(error => {
        });
          const pa3 = await checkNotifications().then( async ({status, settings}) => {
            if(status == "granted"){
              this._storeData("allowNotification", "true");
              allowNotifToChange = true;
              GLOBAL.allowNotification = "true";
            }
            else{
              const pa4 = await requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if(status == "granted"){
                  this._storeData("allowNotification", "true");
                  allowNotifToChange = true;
                  GLOBAL.allowNotification = "true";
                }
                else{
                  this._storeData("allowNotification", "false");
                  allowNotifToChange = false;
                  GLOBAL.allowNotification = "false";
                }
              });
            }
          });
  }

  checkPermissionsIOS = async () => {
      const c1 = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              allowLocToChange = false;
              break;
            case RESULTS.DENIED:
              request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
                if(result == "granted"){
                  this._storeData("allowLocation", "true");
                  allowLocToChange = true;
                }
                else{
                  this._storeData("allowLocation", "false");
                  allowLocToChange = false;
                }
              });
              break;
            case RESULTS.GRANTED:
              this._storeData("allowLocation", "true");
              GLOBAL.allowLocation = "true";
              allowLocToChange = true;
              break;
            case RESULTS.BLOCKED:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              allowLocToChange = false;
              break;
          }
        })
        .catch(error => {
        });
        const c2 = await checkNotifications().then( async ({status, settings}) => {
            if(status == "granted"){
              this._storeData("allowNotification", "true");
              allowNotifToChange = true;
              GLOBAL.allowNotification = "true";
            }
            else{
              const p3 = await requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if(status == "granted"){
                  this._storeData("allowNotification", "true");
                  allowNotifToChange = true;
                  GLOBAL.allowNotification = "true";
                }
                else{
                  this._storeData("allowNotification", "false");
                  allowNotifToChange = false;
                  GLOBAL.allowNotification = "false";
                }
              });
            }
          });
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _cancelSuggestion = () => {
    this.setState({
      suggestionDialog: false
    })
  }

  suggestionDialog = () => {
      this.setState({
        suggestionDialog: true
      })
  }

  _suggest = () => {
    if(allowSuggestionClick && this.state.suggestionMessage != ""){
      allowSuggestionClick = false;
    var details = {
      "token": GLOBAL.authToken,
      "message": this.cleanSmartPunctuation(this.state.suggestionMessage)
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/r/s', {
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
          allowSuggestionClick = true;
          alert("There was an error submitting your suggestion.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          this.setState({
            suggestionDialog: false
          })
          var pass = this;
          setTimeout(function() {
            pass.setState({
              suggestionDialogSubmitted: true,
              suggestionMessage: ""
            })
            allowSuggestionClick = true;
          }, 500);
        }

    })
    .catch((error) => {
      allowSuggestionClick = true;
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }
  }

  _handleSuggestionText = (message) => {
    this.setState({
      suggestionMessage: message
    })
  }

    _cancelReport = () => {
      this.setState({
        reportProblemDialog: false
      })
    }

    reportDialog = () => {
        this.setState({
          reportProblemDialog: true
        })
    }

    _report = () => {
    if(allowProblemClick && this.state.reportProblemMessage != ""){
      allowProblemClick = false;
      var details = {
        "token": GLOBAL.authToken,
        "message": this.cleanSmartPunctuation(this.state.reportProblemMessage)
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/r/p', {
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
            allowProblemClick = true;
            alert("There was an error submitting your report.");
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            this.setState({
              reportProblemDialog: false
            })
            var pass = this;
            setTimeout(function() {
              pass.setState({
                reportProblemDialogSubmitted: true,
                reportProblemMessage: ""
              })
              allowProblemClick=true;
            }, 500);
          }
      })
      .catch((error) => {
        allowProblemClick = true;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
    }

    _handleReportText = (message) => {
      this.setState({
        reportProblemMessage: message
      })
    }

    getNotificationStatus = () => {
      if(this.state.notificationsEnabled){
        return "ON";
      }
      else{
        return "OFF";
      }
    }

    getLocationStatus = () => {
      if(this.state.locationEnabled){
        return "ON";
      }
      else{
        return "OFF";
      }
    }

    destroyNotifToken = () => {
      var details = {
        "token": GLOBAL.authToken,
        "notif_token": "loggedout",
        };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/n/t', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).catch((error) => {
      });
    }

    toggleLocationStatus = async () => {
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
      var allowedToPass = false;
      var currentTime = Math.round((new Date()).getTime() / 1000);
      if(this.state.locTapSlowDown == 0){
        this.setState({
          locTapSlowDown: this.state.locTapSlowDown+1
        });
        var allowedToPass = true;
      }
      else if(this.state.locTapSlowDown%2 == 0 && (this.state.locTapSlowDownTime == "" || this.state.locTapSlowDownTime < currentTime)){
        this.setState({
          locTapSlowDown: this.state.locTapSlowDown+1,
          locTapSlowDownTime: currentTime + 10
        });
        var allowedToPass = true;
      }
      else if(this.state.locTapSlowDown%2 > 0 && (this.state.locTapSlowDownTime == "" || this.state.locTapSlowDownTime < currentTime)){
        this.setState({
          locTapSlowDown: this.state.locTapSlowDown+1
        });
        var allowedToPass = true;
      }
      if(Platform.OS == "ios"){
        const t1 = await this.checkPermissionsIOS();
      }
      else{
        const t2 = await this.checkPermissionsAndroid();
      }
      if(this.state.locationEnabled && allowedToPass && allowLocToChange){
        this.setState({
          locationEnabled: false
        })
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": false
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/s/l', {
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
              alert("There was an error changing your setting.");
              this.setState({
                locationEnabled: true
              })
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.allowNotification = JSON.stringify(this.state.notificationsEnabled);
              GLOBAL.allowLocation = "false";
              this._storeData("allowLocation", "false");
            }

        })
        .catch((error) => {
          this.setState({
            locationEnabled: true
          })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else if(allowedToPass && allowLocToChange){
        this.setState({
          locationEnabled: true
        });
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": true
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/s/l', {
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
              this.setState({
                locationEnabled: false
              });
              alert("There was an error changing your setting.");
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.allowNotification = JSON.stringify(this.state.notificationsEnabled);
              GLOBAL.allowLocation = "true";
              this._storeData("allowLocation", "true");
            }

        })
        .catch((error) => {
          this.setState({
            locationEnabled: false
          })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else if(!allowLocToChange){
        this._locationToggleSwitch.forceHandleSwitch();
        alert("Enable location to change this setting.")
      }
      else{
        this._locationToggleSwitch.forceHandleSwitch();
        alert("Please wait 10 seconds before changing this setting again.");
      }
    }

    toggleNotificationStatus = async () => {
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
      var allowedToPass = false;
      var currentTime = Math.round((new Date()).getTime() / 1000);
      if(this.state.notifTapSlowDown == 0){
        this.setState({
          notifTapSlowDown: this.state.notifTapSlowDown+1
        });
        var allowedToPass = true;
      }
      else if(this.state.notifTapSlowDown%2 == 0 && (this.state.notifTapSlowDownTime == "" || this.state.notifTapSlowDownTime < currentTime)){
        this.setState({
          notifTapSlowDown: this.state.notifTapSlowDown+1,
          notifTapSlowDownTime: currentTime + 10
        });
        var allowedToPass = true;
      }
      else if(this.state.notifTapSlowDown%2 > 0 && (this.state.notifTapSlowDownTime == "" || this.state.notifTapSlowDownTime < currentTime)){
        this.setState({
          notifTapSlowDown: this.state.notifTapSlowDown+1
        });
        var allowedToPass = true;
      }
      if(Platform.OS == "ios"){
        const t3 = await this.checkPermissionsIOS();
      }
      else{
        const t4 = await this.checkPermissionsAndroid();
      }
      if(this.state.notificationsEnabled && allowedToPass && allowNotifToChange){
        this.setState({
          notificationsEnabled: false
        })
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": false
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/s/n', {
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
              this.setState({
                notificationsEnabled: true
              })
              alert("There was an error changing your setting.");
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.allowNotification = "false";
              GLOBAL.allowLocation = JSON.stringify(this.state.locationEnabled);
              this._storeData("allowNotification", "false");
            }

        })
        .catch((error) => {
        this.setState({
          notificationsEnabled: true
        })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else if(allowedToPass && allowNotifToChange){
        this.setState({
          notificationsEnabled: true
        });
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": true
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/s/n', {
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
              this.setState({
                notificationsEnabled: false
              })
              alert("There was an error changing this setting.");
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.allowNotification = "true";
              GLOBAL.allowLocation = JSON.stringify(this.state.locationEnabled);
              this._storeData("allowNotification", "true");
            }

        })
        .catch((error) => {
        this.setState({
          notificationsEnabled: false
        })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else if(!allowNotifToChange){
        this._notificationsToggleSwitch.forceHandleSwitch();
        alert("Enable notifications to change this setting.")
      }
      else{
        this._notificationsToggleSwitch.forceHandleSwitch();
        alert("Please wait 10 seconds before changing this setting again.");
      }
    }

    toggleFriendsEnabled = () => {
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
      var allowedToPass = false;
      var currentTime = Math.round((new Date()).getTime() / 1000);
      if(this.state.friendsEnableTapSlowDown == 0){
        this.setState({
          friendsEnableTapSlowDown: this.state.friendsEnableTapSlowDown+1
        });
        var allowedToPass = true;
      }
      else if(this.state.friendsEnableTapSlowDown%2 == 0 && (this.state.friendsEnableTapSlowDownTime == "" || this.state.friendsEnableTapSlowDownTime < currentTime)){
        this.setState({
          friendsEnableTapSlowDown: this.state.friendsEnableTapSlowDown+1,
          friendsEnableTapSlowDownTime: currentTime + 10
        });
        var allowedToPass = true;
      }
      else if(this.state.friendsEnableTapSlowDown%2 > 0 && (this.state.friendsEnableTapSlowDownTime == "" || this.state.friendsEnableTapSlowDownTime < currentTime)){
        this.setState({
          friendsEnableTapSlowDown: this.state.friendsEnableTapSlowDown+1
        });
        var allowedToPass = true;
      }
      if(this.state.friendsEnabled && allowedToPass){
        this.setState({
          friendsEnabled: false
        })
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": false
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/fp/tsm', {
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
              alert("There was an error changing your setting.");
              this.setState({
                friendsEnabled: true
              })
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.friends.show_me = false;
              this._storeData("friends-me", JSON.stringify(GLOBAL.friends));
            }

        })
        .catch((error) => {
          this.setState({
            friendsEnabled: true
          })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else if(allowedToPass){
        this.setState({
          friendsEnabled: true
        });
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": true
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/fp/tsm', {
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
              this.setState({
                friendsEnabled: false
              });
              alert("There was an error changing your setting.");
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.friends.show_me = true;
              this._storeData("friends-me", JSON.stringify(GLOBAL.friends));
            }

        })
        .catch((error) => {
          this.setState({
            friendsEnabled: false
          })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else{
        this._friendsToggleSwitch.forceHandleSwitch()
        alert("Please wait 10 seconds before changing this setting again.");
      }
    }

    toggleDatingEnabled = () => {
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
      var allowedToPass = false;
      var currentTime = Math.round((new Date()).getTime() / 1000);
      if(this.state.datingEnableTapSlowDown == 0){
        this.setState({
          datingEnableTapSlowDown: this.state.datingEnableTapSlowDown+1
        });
        var allowedToPass = true;
      }
      else if(this.state.datingEnableTapSlowDown%2 == 0 && (this.state.datingEnableTapSlowDownTime == "" || this.state.datingEnableTapSlowDownTime < currentTime)){
        this.setState({
          datingEnableTapSlowDown: this.state.datingEnableTapSlowDown+1,
          datingEnableTapSlowDownTime: currentTime + 10
        });
        var allowedToPass = true;
      }
      else if(this.state.datingEnableTapSlowDown%2 > 0 && (this.state.datingEnableTapSlowDownTime == "" || this.state.datingEnableTapSlowDownTime < currentTime)){
        this.setState({
          datingEnableTapSlowDown: this.state.datingEnableTapSlowDown+1
        });
        var allowedToPass = true;
      }
      if(this.state.datingEnabled && allowedToPass){
        this.setState({
          datingEnabled: false
        })
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": false
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/up/tsm', {
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
              alert("There was an error changing your setting.");
              this.setState({
                datingEnabled: true
              })
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.profile.show_me = false;
              this._storeData("me", JSON.stringify(GLOBAL.profile));
            }

        })
        .catch((error) => {
          this.setState({
            datingEnabled: true
          })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else if(allowedToPass){
        this.setState({
          datingEnabled: true
        });
        var details = {
          "token": GLOBAL.authToken,
          "toggle_value": true
          };

          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/up/tsm', {
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
              this.setState({
                datingEnabled: false
              });
              alert("There was an error changing your setting.");
            }
            else{
              if(responseJson['token'] != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              GLOBAL.profile.show_me = true;
              this._storeData("me", JSON.stringify(GLOBAL.profile));
            }

        })
        .catch((error) => {
          this.setState({
            datingEnabled: false
          })
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
      }
      else{
        this._datingToggleSwitch.forceHandleSwitch()
        alert("Please wait 10 seconds before changing this setting again.");
      }
    }

    logout = async () => {
      this.destroyNotifToken();
        try {
          const at = await AsyncStorage.removeItem("@authToken");
          const me = await AsyncStorage.removeItem("@me");
          const fme = await AsyncStorage.removeItem("@friends-me");
          Actions.pop();
          setTimeout(function(){Actions.replace("login")}, 500);
        } catch (e) {
        }
    }

    _copyProfileURL = () => {
      Clipboard.setString(this.state.shareurl + this.state.myUserid);
      this.setState({
        showCopied: true
      });
      var pass = this;
      setTimeout(function() {
        pass.setState({
          showCopied: false
        })
      }, 2000);
    }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{flex: 1, backgroundColor: "#f8f8ff"}}>
      <SafeAreaView style={{
        backgroundColor: "white"
      }}></SafeAreaView>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "#f8f8ff"
      }}>
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 40, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Settings</Text>
        </View>
        <ScrollView>
          <View style={{minHeight: '100%', minHeight: screenHeight, height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: '#f8f8ff'}}>
              <View style={{marginTop: 10, width: screenWidth, height: 'auto', alignItems: "center"}}>
                {(this.state.datingProfileExists)?
                <TouchableOpacity onPress={() => Actions.profileEdit()} activeOpacity={0.7} style={{margin: 10, height: 100, width: screenWidth*0.9, backgroundColor: "#ff5b99", borderRadius: 20, flexDirection: "row"}}>
                  <View style={{width: screenWidth*0.25, height: 100, backgroundColor: "gray", borderRadius: 20}}>
                    <FastImage source={{uri: this.state.myPicture, priority: FastImage.priority.normal}} style={{height: 100, width: screenWidth*0.25, borderRadius: 20, backgroundColor: "gray"}}>
                    </FastImage>
                  </View>
                  <View style={{height: 100, justifyContent: "center"}}>
                    <Text style={{fontSize: 20, paddingLeft: 10, color: "white", fontFamily: "Raleway-Bold"}}>Dating Profile</Text>
                    <Text style={{fontSize: 14, paddingLeft: 10, paddingTop: 5, color: "white", fontFamily: "Raleway-Medium"}}>Click here to edit.</Text>
                  </View>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => Actions.createDatingProfileFromFriends({pass: this})} activeOpacity={0.7} style={{margin: 10, height: 100, width: screenWidth*0.9, backgroundColor: "#ff5b99", borderRadius: 20, flexDirection: "row", justifyContent: "center"}}>
                  <View style={{height: 100, justifyContent: "center"}}>
                    <Text style={{fontSize: 20, color: "white", textAlign: "center", fontFamily: "Raleway-Bold"}}>Create my Dating Profile</Text>
                    <Text style={{fontSize: 14, paddingTop: 5, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Connect and match with students.</Text>
                  </View>
                </TouchableOpacity>
                }
                {(this.state.friendsProfileExists)?
                <TouchableOpacity onPress={() => Actions.editfriendsprofile()} activeOpacity={0.7} style={{margin: 10, height: 100, width: screenWidth*0.9, backgroundColor: "#5bb8ff", borderRadius: 20, flexDirection: "row"}}>
                  <View style={{width: screenWidth*0.25, height: 100, backgroundColor: "gray", borderRadius: 20}}>
                    <FastImage source={{uri: this.state.myFriendsPicture, priority: FastImage.priority.normal}} style={{height: 100, width: screenWidth*0.25, borderRadius: 20, backgroundColor: "gray"}}>
                    </FastImage>
                  </View>
                  <View style={{height: 100, justifyContent: "center"}}>
                    <Text style={{fontSize: 20, paddingLeft: 10, color: "white", fontFamily: "Raleway-Bold"}}>Friends Profile</Text>
                    <Text style={{fontSize: 14, paddingLeft: 10, paddingTop: 5, color: "white", fontFamily: "Raleway-Medium"}}>Click here to edit.</Text>
                  </View>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => Actions.createFriendsProfileFromDating({pass: this})} activeOpacity={0.7} style={{margin: 10, height: 100, width: screenWidth*0.9, backgroundColor: "#5bb8ff", borderRadius: 20, flexDirection: "row", justifyContent: "center"}}>
                  <View style={{height: 100, justifyContent: "center"}}>
                    <Text style={{fontSize: 20, color: "white", textAlign: "center", fontFamily: "Raleway-Bold"}}>Create my Friends Profile</Text>
                    <Text style={{fontSize: 14, paddingTop: 5, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Connect and message with students.</Text>
                  </View>
                </TouchableOpacity>
                }

                {(this.state.shareurl != "" && this.state.shareurl != undefined && this.state.myUserid != "" && this.state.myUserid != undefined)?
                <View style={{backgroundColor: "white", marginTop: 25}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._copyProfileURL()} style={{width: screenWidth, height: 50, paddingLeft: 15, paddingRight: 15, flexDirection: "row", alignItems: "center"}}>
                    <View style={{height: 30, width: 30, borderRadius: 20, backgroundColor: "#6970ff", justifyContent: "center", alignItems: "center"}}>
                      <Icon name={"link"} type={"med"} size={14} color={"white"} style={{marginLeft: 1, marginTop: 1}} />
                    </View>
                    {(this.state.showCopied)?<Text style={{marginLeft: 5, fontSize: 15, color: "green"}}>Link Copied to Clipboard</Text>:<Text style={{marginLeft: 5, fontSize: 16, color: "black", textAlign: "center", fontFamily: "Raleway-Regular"}}>Share Friends Profile</Text>}
                  </TouchableOpacity>
                </View>:<View style={{backgroundColor: "white", marginTop: 25}}></View>}
                <View style={{backgroundColor: "white"}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.safetyResources()} style={{width: screenWidth, height: 50, paddingLeft: 15, paddingRight: 15, flexDirection: "row", alignItems: "center"}}>
                    <View style={{height: 30, width: 30, borderRadius: 20, backgroundColor: "#FCD12A", justifyContent: "center", alignItems: "center"}}>
                      <Icon name={"info"} type={"med"} size={14} color={"white"} style={{marginLeft: 1, marginTop: 1}} />
                    </View>
                    <Text style={{marginLeft: 5, fontSize: 16, color: "black", textAlign: "center", fontFamily: "Raleway-Regular"}}>Safety Resources</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
                  {(this.state.datingProfileExists)?
                  <View style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Icon name="heart" size={14} color="#ff5b99" family={"FontAwesome"} />
                      <View>
                        <Text style={{fontSize: 20, paddingLeft: 10, paddingTop: 12, color: "black", fontFamily: "Raleway-regular"}}>Show me on Dating</Text>
                        <Text style={{fontSize: 12, paddingLeft: 10, color: "black", fontFamily: "Raleway-regular"}}>Your matches will still see you.</Text>
                      </View>
                    </View>
                    <Switch
                      onRef={(ref) => this._datingToggleSwitch = ref}
                      circleSize={25}
                      value={this.state.datingEnabled}
                      onValueChange={(val) => this.toggleDatingEnabled()}
                      backgroundActive={'#ff5b99'}
                    />
                  </View>:<View></View>}
                  {(this.state.friendsProfileExists)?
                  <View style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Icon name="users" size={14} color="#5bb8ff" family={"FontAwesome"} />
                      <View>
                        <Text style={{fontSize: 20, paddingLeft: 10, paddingTop: 12, color: "black", fontFamily: "Raleway-regular"}}>Show me on Friends</Text>
                        <Text style={{fontSize: 12, paddingLeft: 10, color: "black", fontFamily: "Raleway-regular"}}>Your friends will still see you.</Text>
                      </View>
                    </View>
                    <Switch
                      onRef={(ref) => this._friendsToggleSwitch = ref}
                      circleSize={25}
                      value={this.state.friendsEnabled}
                      onValueChange={(val) => this.toggleFriendsEnabled()}
                      backgroundActive={'#5bb8ff'}
                    />
                  </View>:<View></View>}
                  <TouchableOpacity onPress={() => Actions.preferences()} activeOpacity={0.7}  style={{marginBottom: 10, height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{fontSize: 20, paddingTop: 15, paddingBottom: 10, color: "black", fontFamily: "Raleway-regular"}}>My Preferences</Text>
                    <View style={{paddingTop: 10}}><LineIcon name="arrow-right" size={14} color="#000000" /></View>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: 40, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
                  <View style={{marginTop: 10, height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Icon name="bell" size={14} color="#000000" family={"FontAwesome"} />
                      <Text style={{fontSize: 20, paddingLeft: 10, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-regular"}}>Notifications</Text>
                    </View>
                    <Switch
                      onRef={(ref) => this._notificationsToggleSwitch = ref}
                      circleSize={25}
                      value={this.state.notificationsEnabled}
                      onValueChange={(val) => this.toggleNotificationStatus()}
                      backgroundActive={'black'}
                    />
                  </View>
                  <View style={{marginBottom: 10, height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Icon name="location-arrow" size={18} color="#000000" family={"FontAwesome"} />
                      <Text style={{fontSize: 20, paddingLeft: 10, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-regular"}}>Location</Text>
                    </View>
                    <Switch
                      onRef={(ref) => this._locationToggleSwitch = ref}
                      circleSize={25}
                      value={this.state.locationEnabled}
                      onValueChange={(val) => this.toggleLocationStatus()}
                      backgroundActive={'black'}
                    />
                  </View>
                </View>
                <View style={{marginTop: 40, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
                  <TouchableOpacity onPress={() => this.suggestionDialog()} activeOpacity={0.7}  style={{marginTop: 10, height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{fontSize: 20, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-regular"}}>Give Feedback</Text>
                    <View><LineIcon name="emotsmile" size={18} color="#000000" /></View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.logout()} activeOpacity={0.7}  style={{marginBottom: 10, marginTop: 10, height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{fontSize: 20, paddingTop: 10, paddingBottom: 10, color: "red", fontFamily: "Raleway-regular"}}>Logout</Text>
                    <View><LineIcon name="logout" size={18} color="red" /></View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL("https://rumine.ca/app")} activeOpacity={0.7}  style={{marginBottom: 10, marginTop: 10, height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{fontSize: 20, paddingTop: 10, paddingBottom: 10, color: "gray", fontFamily: "Raleway-regular"}}>Delete Account</Text>
                    <View><LineIcon name="close" size={18} color="gray" /></View>
                  </TouchableOpacity>
                </View>
                </View>
            <Text style={{fontSize: 20, paddingTop: 25, textAlign: "center", color: "black"}}>Version 0.8.6</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL("https://rumine.ca/tos")}>
              <Text style={{fontSize: 16, textAlign: "center", color: "gray"}}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL("https://rumine.ca/privacy")}>
              <Text style={{fontSize: 16, textAlign: "center", color: "gray"}}>Privacy Policy</Text>
            </TouchableOpacity>
            <View style={{height: 50, width: screenWidth}}></View>
          </View>
        </ScrollView>
        <View>
          <Dialog.Container visible={this.state.reportProblemDialog}>
            <Dialog.Title>Report a Problem</Dialog.Title>
            <Dialog.Description>
              What problem did you find?
            </Dialog.Description>
            <Dialog.Input
              placeholder="Problem"
              placeholderTextColor="#aaaaaa"
              style={{color: "black"}}
              multiline={true}
              onChangeText={(message) => this._handleReportText(message)}
              >
              </Dialog.Input>
              <Dialog.Button onPress={() => this._cancelReport()} label="Cancel" />
              <Dialog.Button onPress={() => this._report()} label="Submit" />
            </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.suggestionDialog}>
            <Dialog.Title>Give us your feedback!</Dialog.Title>
            <Dialog.Description>
              What should we know?
            </Dialog.Description>
            <Dialog.Input
              placeholder="Type something here..."
              placeholderTextColor="#aaaaaa"
              style={{color: "black"}}
              multiline={true}
              onChangeText={(message) => this._handleSuggestionText(message)}
              >
              </Dialog.Input>
              <Dialog.Button onPress={() => this._cancelSuggestion()} label="Cancel" />
              <Dialog.Button onPress={() => this._suggest()} label="Submit" />
            </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.reportProblemDialogSubmitted}>
            <Dialog.Title>Report Submitted</Dialog.Title>
            <Dialog.Description>
              Thanks for your report! We are going to look into it.
            </Dialog.Description>
            <Dialog.Button onPress={() => this.setState({reportProblemDialogSubmitted: false})} label="OK" />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.suggestionDialogSubmitted}>
            <Dialog.Title>Feedback Submitted</Dialog.Title>
            <Dialog.Description>
              Thanks for your feedback!
            </Dialog.Description>
            <Dialog.Button onPress={() => this.setState({suggestionDialogSubmitted: false})} label="OK" />
          </Dialog.Container>
        </View>
      </View>
    </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
