import React, {Component} from 'react';
import { Linking, ActivityIndicator, AppState, Button, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL from '../global.js'
import {saveCache, loadCache} from '../cache.js';
import cache from '../in_memory_cache.js';
import badges from '../badges.js'
import Dialog from "react-native-dialog";
import { Actions } from 'react-native-router-flux';
import Geolocation from 'react-native-geolocation-service';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import RBSheet from "react-native-raw-bottom-sheet";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { RNNotificationBanner } from 'react-native-notification-banner';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Profile from '../components/Profile';
import MatchScreen from '../components/MatchScreen';
import NoTimeline from '../components/NoTimeline';
import SwipeCard from '../components/SwipeCard';
import ProfileInCard from '../components/ProfileInCard';
import LoadingTimeline from '../components/LoadingTimeline';
import FirstTime from '../components/FirstTime';
import navlogo from '../assets/images/NBF.png';
import slowdown from '../assets/images/slowdown.jpg';
import PenguinFriends from '../assets/svgs/penguin_friends.svg';
import GroupsSVG from '../assets/svgs/groups.svg';
import DatingPenguins from '../assets/svgs/dating_penguins.svg';
import GoneFishing from '../assets/svgs/penguins_gone_fishing.svg';
import PenguinAndZebraSkating from '../assets/svgs/penguin_and_zebra_skating.svg';
import VerticalScroll from '../assets/svgs/vertical_scroll.svg';
import {Notifications} from 'react-native-notifications';
import LinearGradient from 'react-native-linear-gradient';
import SwipeCards from 'react-native-swipe-cards';
import ProfileBadge from '../components/ProfileBadge';
import SpotifyBubble from '../components/SpotifyBubble';
import InterestBubble from '../components/InterestBubble';
import FriendProfileCard from '../components/FriendProfileCard';
import Carousel from 'react-native-snap-carousel';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import {check, request, PERMISSIONS, RESULTS, checkNotifications, requestNotifications} from 'react-native-permissions';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import FastImage from 'react-native-fast-image';
import { apiCall } from '../utilities/Connector';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
screenHeight = Platform.select({
  ios: screenHeight,
  android:
    StatusBar.currentHeight > 24
      ? screenHeight
      : screenHeight - StatusBar.currentHeight,
});

let match_icon = <Icon name="heart" size={24} color="#FFFFFF" family={"FontAwesome"} />;
let message_icon = <Icon name="comment" size={24} color="#ffffff" family={"FontAwesome"} />;
let announcement_icon = <Icon name="bullhorn" size={24} color="#ffffff" family={"FontAwesome"} />;
let join_icon = <Icon name="plus" size={24} color="#ffffff" family={"FontAwesome"} />;
let post_icon = <Icon name="comments" size={24} color="#ffffff" family={"FontAwesome"} />;
let request_icon = <LineIcon name="user-follow" size={24} color="#ffffff" family={"SimpleLineIcons"} />;

let swipe_time_array = [];
let gotArtistData = false;
var allowReportClick = true;
var allowBlockClick = true;
let alreadyCalledTimeline = false;
let previousFriendSwipeIndex = -1;
var notCallingFriendsTimeline = true;
var addedNoMore = false;
var hasNoMoreApplied = false;
var callingGetFriendsTimeline = false;

let allowNotifToChange = true;

const feedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};



class Swipe extends Component {

  getWindowDimension(event) {

      this.device_width = event.nativeEvent.layout.width,
      this.device_height = event.nativeEvent.layout.height

      var bottomBarIsOpen = (this.device_height<screenHeight);
      this.setState({
        bottomBarIsOpen: bottomBarIsOpen,
        topNotchOffset: StaticSafeAreaInsets.safeAreaInsetsTop,
        bottomNotchOffset: StaticSafeAreaInsets.safeAreaInsetsBottom
      })

    }

  constructor(props){
    super(props);
    this.references = {};
  }

  componentWillReceiveProps(){
    if(GLOBAL.fromMatches){
      GLOBAL.fromMatches = false;
      this.getNotificationCount();
    }
    else {
      this.getMe();
      this.getNotificationToken();
      //this.getTimeline(true, 0);
    }
  }

  shouldComponentUpdate(){
    return true;
  }

  componentDidMount() {
    this.setState({
      topNotchOffset: StaticSafeAreaInsets.safeAreaInsetsTop,
      bottomNotchOffset: StaticSafeAreaInsets.safeAreaInsetsBottom
    });
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
      this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
    if(!GLOBAL.hasConnectedToFireBase){
      AppState.addEventListener('change', this._handleAppStateChange);
      const unsubscribe = firebase.messaging().onMessage((message) => {
        GLOBAL.hasConnectedToFireBase = true;
        if(Platform.OS == "android"){
          if((message.data.type == "request" || message.data.type == "friend-message" || message.data.type == "group-chat" || message.data.type == "match" || message.data.type == "message") && Actions.currentScene == "matches"){
            cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
            this.setState({notifCount: this.state.notifCount + 1});
            Actions.refresh();
          }
          else if((message.data.type == "friend-message" || message.data.type == "message" || message.data.type == "group-chat") && Actions.currentScene == "matchConvo"){
            cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
            this.setState({notifCount: this.state.notifCount + 1});
          }
          else{
            ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
            if(message.data.type == "match"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New match!", subTitle: "Don't leave them waiting, send a message!", tintColor: "#ff6ea5", withIcon: true, icon: match_icon, onClick: this.onClickNotificationBanner});
            }
            else if (message.data.type == "message"){
              var name = message.data.name;
              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z]/.test(name))){
                name = "Somebody";
              }
              var subtitle = name + " sent a message!"
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New Message", subTitle: subtitle, tintColor: "#ff6ea5", withIcon: true, icon: message_icon, onClick: this.onClickNotificationBanner});
            }
            else if (message.data.type == "announcement"){
              var title = message.data.title;
              var subtitle = message.data.subtitle;
              RNNotificationBanner.Success({ title: title, subTitle: message.data.subtitle, tintColor: "#6ed4ff", withIcon: true, icon: announcement_icon});
            }
            else if (message.data.type == "request"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New Friend Request", subTitle: message.data.subtitle, tintColor: "#6ed4ff", withIcon: true, icon: request_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
            else if (message.data.type == "friend"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New Friend", subTitle: message.data.subtitle, tintColor: "#6ed4ff", withIcon: true, icon: request_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
            else if (message.data.type == "friend-message"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              var title = message.data.title;
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;
              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z\-\ ]+$/.test(name))){
                name = "Somebody";
              }
              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = name + " sent a message!";
              }
              else{
                var subtitle = name + ": " + message.data.subtitle;
                if(subtitle.length > 47){
                  subtitle = subtitle.substring(0,47) + "...";
                }
              }
              RNNotificationBanner.Show({ title: "New Message", subTitle: subtitle, tintColor: "#6ed4ff", withIcon: true, icon: message_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-post"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z0-9\-\ ]+$/.test(name))){
                name = "your groups";
              }
              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check " + name + " for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: (name == "your groups")?"New Post":name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: post_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-add"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: join_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-join"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: join_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "post-comment"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: post_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "liked-comment"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: match_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "liked-post"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: match_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-chat"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z0-9\-\ ]+$/.test(name))){
                name = "New Message";
              }
              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                subtitle = "You have new messages in groups.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: message_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
          }
        }
        else if(Platform.OS == "ios"){
          if((message.data.type == "request" || message.data.type == "friend-message" || message.data.type == "group-chat" || message.data.type == "match" || message.data.type == "message") && Actions.currentScene == "matches"){
            cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
            this.setState({notifCount: this.state.notifCount + 1});
            Actions.refresh();
          }
          else if((message.data.type == "friend-message" || message.data.type == "message" || message.data.type == "group-chat") && Actions.currentScene == "matchConvo"){
            cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
            this.setState({notifCount: this.state.notifCount + 1});
          }
          else{
            ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
            if(message.data.type == "match"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New match!", subTitle: "Don't leave them waiting, send a message!", tintColor: "#ff6ea5", withIcon: true, icon: match_icon, onClick: this.onClickNotificationBanner});
            }
            else if (message.data.type == "message"){
              var name = message.data.name;
              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z\-\ ]+$/.test(name))){
                name = "Somebody";
              }
              var subtitle = name + " sent a message!";
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New Message", subTitle: subtitle, tintColor: "#ff6ea5", withIcon: true, icon: message_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
            else if (message.data.type == "announcement"){
              var title = message.data.title;
              var subtitle = message.data.subtitle;
              RNNotificationBanner.Show({ title: title, subTitle: message.data.subtitle, tintColor: "#6ed4ff", withIcon: true, icon: announcement_icon});
            }
            else if (message.data.type == "request"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New Friend Request", subTitle: message.data.subtitle, tintColor: "#6ed4ff", withIcon: true, icon: request_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
            else if (message.data.type == "friend"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              RNNotificationBanner.Show({ title: "New Friend", subTitle: message.data.subtitle, tintColor: "#6ed4ff", withIcon: true, icon: request_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
            else if (message.data.type == "friend-message"){
              cache.in_memory_cache['notification_count'] = this.state.notifCount + 1;
              this.setState({notifCount: this.state.notifCount + 1});
              var title = message.data.title;
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;
              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z\-\ ]+$/.test(name))){
                name = "Somebody";
              }
              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = name + " sent a message!";
              }
              else{
                var subtitle = name + ": " + message.data.subtitle;
                if(subtitle.length > 47){
                  subtitle = subtitle.substring(0,47) + "...";
                }
              }
              RNNotificationBanner.Show({ title: "New Message", subTitle: subtitle, tintColor: "#6ed4ff", withIcon: true, icon: message_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-post"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z0-9\-\ ]+$/.test(name))){
                name = "your groups";
              }
              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check " + name + " for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: (name == "your groups")?"New Post":name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: post_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-add"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: join_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-join"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: join_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "post-comment"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: post_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "liked-comment"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: match_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "liked-post"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                var subtitle = "Check your groups for the latest.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: match_icon, onClick: this.onClickGroupNotificationBanner.bind(this)});
            }
            else if (message.data.type == "group-chat"){
              var name = message.data.name;
              var subtitle_data = message.data.subtitle;

              if(name == undefined || name == null || name == "" || !(/^[a-zA-Z0-9\-\ ]+$/.test(name))){
                name = "New Message";
              }
              if(subtitle_data == undefined || subtitle_data == null || subtitle_data == "" || (/[\<\>\=]+/g.test(subtitle_data))){
                subtitle = "You have new messages in groups.";
              }
              else{
                var subtitle = subtitle_data;
              }
              RNNotificationBanner.Show({ title: name, subTitle: subtitle, tintColor: "#6970ff", withIcon: true, icon: message_icon, onClick: this.onClickNotificationBanner.bind(this)});
            }
          }
        }
       });
    }
    this.checkToken();
    this.getMe();
    if(GLOBAL.allowLocation == "true"){
      GLOBAL.watchposid = Geolocation.watchPosition((position) => {
          this.sendLocation(position);
        },
        (error) => {
          // See error code charts below.
          },
          { enableHighAccuracy: true, distanceFilter: 25, timeout: 15000, maximumAge: 10000 })
    }
  }

  _handleAppStateChange = (nextAppState) => {
   if (nextAppState === 'active') {
     Notifications.removeAllDeliveredNotifications()
     if(GLOBAL.allowLocation == "true"){
       GLOBAL.watchposid = Geolocation.watchPosition((position) => {
           this.sendLocation(position);
         },
         (error) => {
           // See error code charts below.
           },
           { enableHighAccuracy: true, distanceFilter: 25, timeout: 15000, maximumAge: 10000 })
     }
   }
   else if (nextAppState === 'background') {
     Geolocation.clearWatch(GLOBAL.watchposid);
     saveCache();
   }
   else if (nextAppState === 'inactive') {
    Geolocation.clearWatch(GLOBAL.watchposid);
    saveCache();
    }
    else{
     Geolocation.clearWatch(GLOBAL.watchposid);
   }
 };

  onClickNotificationBanner = () => {
    Actions.matches();
    RNNotificationBanner.Dismiss();
  }

  onClickGroupNotificationBanner = () => {
    Actions.groups();
    RNNotificationBanner.Dismiss();
  }

  componentWillUnmount(){
    Linking.removeEventListener('url', this.handleOpenURL);
    Geolocation.clearWatch(GLOBAL.watchposid);
  }

  //DEEP LINKING
  handleOpenURL = (event) => {
    this.navigate(event.url);
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  navigate = async (url) => {
    if(GLOBAL == undefined || GLOBAL.authToken == undefined || GLOBAL.authToken == ""){
      await this.sleep(2000);
    }
    if(url == null || url == undefined){
      return;
    }
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];

    if (routeName === 'group') {
      const groupid = route.split('/')[1];
      Actions.groupTimeline({image: "", groupid: groupid, groupName: "", isGroupAdmin: false, isPrivate: true, isMember: false})
    }
    else if (routeName === 'post'){
      //Todo
    }
    else if (routeName === 'profile'){
      const userid = route.split('/')[1];
      Actions.previewprofile({allowReport: true, allowFriending: true, fromFriendsConvo: true, userid: userid})
    }
  }

  //////////////

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  getNotificationToken = async() => {
    if(GLOBAL.authToken != ""){
      let fcmToken = "";
      //const hasPermission = await firebase.messaging().hasPermission();
      firebase.messaging().requestPermission().then((value) => {
        if (value === messaging.AuthorizationStatus.AUTHORIZED) {
          this._storeData("allowNotification", "true");
          GLOBAL.allowNotification = "true";
        } else if (value === messaging.AuthorizationStatus.PROVISIONAL) {
          this._storeData("allowNotification", "true");
          GLOBAL.allowNotification = "true";
        } else {
          this._storeData("allowNotification", "false");
          GLOBAL.allowNotification = "false";
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
          }).then((response) => response.json())
            .then((responseJson) => {
              if(responseJson == "logout"){
                Actions.replace("login");
              }
              else{
                if(responseJson['token'] != "NA" && responseJson.error == null){
                  this._storeData("authToken", responseJson.token);
                  GLOBAL.authToken = responseJson.token;
                }
              }
          })
          .catch((error) => {
          });
          return;
        }
          firebase.messaging().getToken().then(token => {
            fcmToken = token;

            var details = {
              "token": GLOBAL.authToken,
              "notif_token": fcmToken,
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
            }).then((response) => response.json())
              .then((responseJson) => {
                if(responseJson == "logout"){
                  Actions.replace("login");
                }
                else{
                  if(responseJson['token'] != "NA" && responseJson.error == null){
                    this._storeData("authToken", responseJson.token);
                    GLOBAL.authToken = responseJson.token;
                  }
                }
            })
            .catch((error) => {
            });
          });
      });
    }
    else{
      Actions.replace("login");
    }
  }

  sendLocation = (position) => {
    if(GLOBAL.allowLocation == "true" && GLOBAL.location_last_sent < Math.round((new Date()).getTime() / 1000)){
      GLOBAL.location_last_sent = Math.round((new Date()).getTime() / 1000) + 60;
      var details = {
        "token": GLOBAL.authToken,
        "longitude": position.coords.longitude,
        "latitude": position.coords.latitude,
        "accuracy": Math.floor(position.coords.accuracy),
        "altitude": position.coords.altitude
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      if(GLOBAL.authToken != ""){
        return fetch('https://rumine.ca/_apiv2/gw/l/s', {
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
            else{
              if(responseJson['token'] != "NA" && responseJson.error == null){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
            }
        })
        .catch((error) => {
        });
      }
    }
  }

  syncProfiles = async () => {
    if(cache.in_memory_cache == undefined) {
      return;
    }
    else if (cache.in_memory_cache['last_profile_sync'] != undefined && (Math.round((new Date()).getTime()/1000) - cache.in_memory_cache['last_profile_sync']) < 1800){
      return;
    }
    cache.in_memory_cache['last_profile_sync'] =  Math.round((new Date()).getTime()/1000);
    var formdata = new FormData();
    const resp = await apiCall("/gw/sync", formdata);
    var profData = resp.dating;
    var toSaveDating = {};
    var toSaveFriends = {};
    console.log(resp);
    if(profData == null){
      GLOBAL.profile = toSaveDating;
      this._storeData("me", JSON.stringify(toSaveDating));
    }
    else{
      toSaveDating = {
        'firstname_display': profData.firstname_display,
        'lastname': profData.lastname,
        'birthdate': profData.birthdate,
        'program': profData.program,
        'year': profData.year,
        'pronouns': profData.pronouns,
        'lookingFor': profData.lookingFor,
        'bio': profData.bio,
        'gender': profData.gender,
        'int_m': profData.int_m,
        'int_f': profData.int_f,
        'int_nb': profData.int_nb,
        'int_t': profData.int_t,
        'int_o': profData.int_o,
        'start_age': profData.start_age,
        'end_age': profData.end_age,
        'reshow_profiles': profData.reshow_profiles,
        'image0': (profData.image0=="null")?null:profData.image0,
        'image1': (profData.image1=="null")?null:profData.image1,
        'image2': (profData.image2=="null")?null:profData.image2,
        'image3': (profData.image3=="null")?null:profData.image3,
        'top_5_spotify': profData.top_5_spotify,
        'interests': profData.interests,
        'badges': profData.badges,
        'show_me': profData.datingEnabled
      };
      GLOBAL.profile = toSaveDating;
      this._storeData("me", JSON.stringify(toSaveDating));
    }

    var fprofData = resp.friends;
    if(fprofData == null){
      GLOBAL.friends = toSaveFriends
      this._storeData("friends-me", JSON.stringify(toSaveFriends));
    }
    else{
      toSaveFriends = {
        'userid': fprofData.userid,
        'firstname_display': fprofData.firstname_display,
        'lastname': fprofData.lastname,
        'birthdate': fprofData.birthdate,
        'program': fprofData.program,
        'year': fprofData.year,
        'pronouns': fprofData.pronouns,
        'bio': fprofData.bio,
        'image0': (fprofData.image0=="null")?null:fprofData.image0,
        'image1': (fprofData.image1=="null")?null:fprofData.image1,
        'image2': (fprofData.image2=="null")?null:fprofData.image2,
        'image3': (fprofData.image3=="null")?null:fprofData.image3,
        'top_5_spotify': fprofData.top_5_spotify,
        'interests': fprofData.interests,
        'badges': fprofData.badges,
        'classes': fprofData.classes,
        'algo_pref': fprofData.algo_pref,
        'show_me': fprofData.show_me
      };
      GLOBAL.friends = toSaveFriends
      this._storeData("friends-me", JSON.stringify(toSaveFriends));
    }

    GLOBAL.shareurl = resp.shareurl;

    GLOBAL.allowLocation=profData.allow_location_tracking;
    GLOBAL.allowNotification=profData.allow_notifications;

    this._storeData("allowLocation", JSON.stringify(profData.allow_location_tracking));
    this._storeData("allowNotification", JSON.stringify(profData.allow_notifications));
    this._storeData("shareurl", GLOBAL.shareurl);
  }

  checkToken = async () => {
    var pass = this;
    try {
      const value = await AsyncStorage.getItem('@authToken')
      if(value !== null && value != undefined) {
        // value previously stored
        if(value == "logout"){
          Actions.replace("login");
        }
        else{
          this.setState({
            authToken: value
          });
          GLOBAL.authToken = value;
          setTimeout(function() {
            pass.getNotificationCount();
            pass.getNotificationToken();
            loadCache(pass);
            setTimeout(() => {
              pass.syncProfiles();
            }, 2000);
          }, 200);
        }
      }
      else{
        Actions.replace("login");
      }
    } catch(e) {
      // error reading value
      Actions.replace("login");
    }
  }

  getMe = async () => {
    try {
      const value = await AsyncStorage.getItem('@me')
      const valueFriends = await AsyncStorage.getItem('@friends-me')
      const valueLoc = await AsyncStorage.getItem('@allowLocation')
      const valueNotif = await AsyncStorage.getItem('@allowNotification')
      const shareUrl = await AsyncStorage.getItem('@shareurl')
      const value_ruf = await AsyncStorage.getItem('@hasSeenRUFriendsDialog')
      if(value !== null || valueFriends !== null) {
        // value previously stored
        if(valueLoc == "" || valueLoc == null || valueLoc == undefined){
          callingGetFriendsTimeline = false;
          addedNoMore = false;
          Actions.replace("login");
        }
        if(valueNotif == "" || valueNotif == null || valueNotif == undefined){
          callingGetFriendsTimeline = false;
          addedNoMore = false;
          Actions.replace("login");
        }
        var value_parsed = JSON.parse(value);
        var valueFriends_parsed = JSON.parse(valueFriends);
        if((valueFriends_parsed == null || valueFriends_parsed == undefined || valueFriends_parsed.firstname_display == undefined) && (value_parsed == null || value_parsed == undefined || value_parsed.firstname_display == undefined)){
          if(value_parsed.show_me == undefined){
            value_parsed.show_me = true;
          }
          callingGetFriendsTimeline = false;
          addedNoMore = false;
          Actions.replace("login");
        }
        else{

            GLOBAL.profile=value_parsed
            GLOBAL.friends=valueFriends_parsed

            this.setState({
              myPicture: (GLOBAL.profile == undefined || GLOBAL.profile.image0 == undefined)?"https://rumine.ca/_i/s/i.php?i=" + GLOBAL.friends.image0:"https://rumine.ca/_i/s/i.php?i=" + GLOBAL.profile.image0
            })

            //Decide what timeline to fetch

            //If coming from just creating dating or friends from createprofile then do that timeline
            callingGetFriendsTimeline = false;
            addedNoMore = false;
            if(this.props.firstTimeFriends && !this.state.accepted){
              this.setState({
                matchingType: "friends",
              });
              this.getFriendsTimeline([]);
            }
            else if(this.props.firstTime && !this.state.accepted){
              this.setState({
                matchingType: "dating",
              });
              this.getTimeline(true, 0);
            }
            //Now try cache if available
            else if(cache.in_memory_cache != undefined && cache.in_memory_cache['lastScreen'] == "dating" && GLOBAL.profile != undefined && GLOBAL.profile.firstname_display != undefined){
              this.setState({
                matchingType: "dating",
              });
              this.getTimeline(true, 0);
            }
            else if(cache.in_memory_cache != undefined && cache.in_memory_cache['lastScreen'] == "friends" && GLOBAL.profile != undefined && GLOBAL.profile.firstname_display != undefined){
              this.setState({
                matchingType: "friends",
              });
              this.getFriendsTimeline([]);
            }
            //Now last attempt is checking what profile is made
            else if(GLOBAL.profile != undefined && GLOBAL.profile.firstname_display != undefined){
              this.setState({
                matchingType: "dating",
              });
              this.getTimeline(true, 0);
            }
            else if(GLOBAL.friends != undefined && GLOBAL.friends.firstname_display != undefined){
              this.setState({
                matchingType: "friends",
              });
              this.getFriendsTimeline([]);
            }

            if(GLOBAL.shareurl == undefined){
              GLOBAL.shareurl=shareUrl;
            }
            if(GLOBAL.allowLocation == undefined){
              GLOBAL.allowLocation=valueLoc;
            }
            if(GLOBAL.allowNotification == undefined){
              GLOBAL.allowNotification=valueNotif;
            }
            if(value_ruf != "true" && (GLOBAL.friends == undefined || GLOBAL.friends.firstname_display == undefined)) {
              this.setState({
                showRUFriendsDialog: true
              });
            }
        }
      }
      else{
        callingGetFriendsTimeline = false;
        addedNoMore = false;
        Actions.replace("login");
      }
    } catch(e) {
      // error reading value
      callingGetFriendsTimeline = false;
      addedNoMore = false;
      Actions.replace("login");
    }
  }

  getNotificationCount = () => {
    var pass = this;
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
    return fetch('https://rumine.ca/_apiv2/gw/n/g', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout" || responseJson.message == "No entity found for query"){
          Actions.replace("login");
        }
        else{
          if(responseJson['token'] != "NA" && responseJson.error == null){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(responseJson.data != undefined && responseJson.data != null){
            pass.setState({
              notifCount: parseInt(responseJson.data)
            });
            cache.in_memory_cache['notification_count'] = parseInt(responseJson.data);
          }
        }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  getTimeline = (init_load, offset) => {
    if(offset < 0){
      offset = 0;
    }
    var pass = this;
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
    return fetch('https://rumine.ca/_apiv2/gw/t/g/' + offset, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout" || responseJson.message == "No entity found for query"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error getting your timeline. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA" && responseJson.error == null){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(init_load == true){
            //var uid = responseJson.status[0];
            //pass.getMatch(uid);
            //responseJson.status.shift();
            pass.setState({
              tuser: responseJson.status,
            });
          }
          else{
            if(this.state.tuser !== undefined){
              if(responseJson.status.length > 0){
                var maxToCut = this.state.tuser.length - 5;
                if(maxToCut < 0){
                  maxToCut = 0;
                }
                var arr = this.state.tuser.concat(responseJson.status);//.slice(maxToCut);
                this.setState({
                  tuser: arr
                })
              }
              else if(this.state.tuser.length == 0){
                this.setState({
                  tuser: []
                });
              }
            }
            alreadyCalledTimeline = false;
          }
        }
    })
    .catch((error) => {
      this.setState({
        datingTimelineFail: true
      });
    });
  }

  getFriendsTimeline = (uids, init) => {
    if((addedNoMore || callingGetFriendsTimeline) && !(this.props.firstTimeFriends && !this.state.accepted)){
      return;
    }
    callingGetFriendsTimeline = true;
    var pass = this;
     var details = {
      "token": GLOBAL.authToken,
      "uids": uids
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/ft/g', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          notCallingFriendsTimeline = true;
          callingGetFriendsTimeline = false;
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          notCallingFriendsTimeline = true;
          callingGetFriendsTimeline = false;
          alert("There was an error getting your timeline. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA" && responseJson.error == null){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          notCallingFriendsTimeline = true;
          callingGetFriendsTimeline = false;
          if(init){
            previousFriendSwipeIndex = 0;
            if(responseJson.status.length < 15){
              addedNoMore = true;
              hasNoMoreApplied = true;
              this.setState({
                friendsTimeline: [...responseJson.status, {"userid":"nomore"}]
              })
            }
            else{
              hasNoMoreApplied = false;
              this.setState({
                friendsTimeline: [...responseJson.status]
              })
            }
          }
          else{
            if(hasNoMoreApplied){
              previousFriendSwipeIndex = 0;
              if(responseJson.status.length < 15){
                addedNoMore = true;
                hasNoMoreApplied = true;
                this.setState({
                  friendsTimeline: [...responseJson.status, {"userid":"nomore"}]
                })
              }
              else{
                hasNoMoreApplied = false;
                this.setState({
                  friendsTimeline: [...responseJson.status]
                })
              }
            }
            else{
              if(responseJson.status.length < 15){
                addedNoMore = true;
                hasNoMoreApplied = true;
                this.setState({
                  friendsTimeline: [...this.state.friendsTimeline, ...responseJson.status, {"userid":"nomore"}]
                })
              }
              else{
                this.setState({
                  friendsTimeline: [...this.state.friendsTimeline, ...responseJson.status]
                })
              }
            }
          }
        }
    })
    .catch((error) => {
      notCallingFriendsTimeline = true;
      callingGetFriendsTimeline = false;
      this.setState({
        friendsTimeline: [{"userid":"error"}]
      })
      //alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  closeRUFriendsDialog = () => {
    this.setState({
      showRUFriendsDialog: false
    })
    GLOBAL.hasSeenRUFriendsDialog = true;
    this._storeData("hasSeenRUFriendsDialog", "true");
  }

  closeGroupsDialog = () => {
    this.setState({
      showGroupsDialog: false
    })
  }

  closeRUMineDialog = () => {
    this.setState({
      showRUMineDialog: false
    })
  }

  migrateToFriends = () => {
    this.setState({
      showRUFriendsDialog: false,
      showGroupsDialog: false,
      showRUFriendsMigrate: true,
      friendsMigrationIsLoading: true
    });
    //Send call to migrate function
    this.sendMigrateToBackend();
  }

  sendMigrateToBackend = () => {
    var pass = this;
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
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error transferring your profile. Please try again later.");
          this.setState({
            friendsMigrationIsLoading: false,
            showRUFriendsMigrate: false
          });
        }
        else{
          if(responseJson['token'] != "NA" && responseJson.error == null){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          //Do local profile management
          GLOBAL.friends = {};
          GLOBAL.friends.userid = responseJson.userid;
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

          this.setState({
            friendsMigrationIsLoading: false
          });
        }
    })
    .catch((error) => {
      this.setState({
        friendsMigrationIsLoading: false,
        showRUFriendsMigrate: false
      });
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  state = {
    myPicture: "",
    bottomNotchOffset: 0,
    topNotchOffset: 0,
    bottomBarIsOpen: false,
    friendsMigrationIsLoading: false,
    showRUFriendsMigrate: false,
    showRUFriendsDialog: false,
    showGroupsDialog: false,
    requiresRefresh: false,
    report_userid: "",
    report_username: "",
    reportUserDialog: false,
    reportUserMessage: "",
    reportUserDialogSubmitted: false,
    authToken: "",
    matchScreenVisible: false,
    dialogVisible: false,
    dialogTitle: "Edit Name/Age",
    dialogType: 0,
    captionNum: 0,
    userid: "",
    username: "",
    birthdate: "",
    program: "",
    year: "",
    pronouns: "",
    lookingFor: "",
    bio: "",
    caption0: "",
    caption1: "",
    caption2: "",
    storyHeadline: "",
    story: "",
    picture0: "",
    picture1: "",
    picture2: "",
    picture3: "",
    accepted: false,
    tuser: [],
    loading: true,
    lastClicked: 0,
    notifCount: (cache.in_memory_cache && cache.in_memory_cache['notification_count'])?cache.in_memory_cache['notification_count']:0,
    allowClick: true,
    previousCard: "",
    tdict: {},
    prevtdict: {},
    cards: [
      {text: 'Tomato', backgroundColor: 'red'},
      {text: 'Aubergine', backgroundColor: 'purple'},
      {text: 'Courgette', backgroundColor: 'green'},
      {text: 'Blueberry', backgroundColor: 'blue'},
      {text: 'Umm...', backgroundColor: 'cyan'},
      {text: 'orange', backgroundColor: 'orange'},
    ],
    full: false,
    temp_spotifyData: [],
    spotifyLoading: true,
    matchingType: (cache.in_memory_cache && cache.in_memory_cache['lastScreen'])?cache.in_memory_cache['lastScreen']:"",
    friendsTimeline: [],
    datingTimelineFail: false,
    showFriendsTutorial: false,
    showDatingTutorial: false
  }

  closeMatchScreen = () => {
    this.setState({
      matchScreenVisible: false
    })
  }

  acceptFirstTime = () => {
    this.setState({
      accepted: true,
      showDatingTutorial: false
    });
  }

  renderMatchedScreen = (card) => {
    var matchedPicture = 'https://rumine.ca/_i/s/i.php?i=' + card.image0;
    var matchedName = card.firstname_display;
    this.setState({
      matchScreenVisible: true,
      matchedPicture: matchedPicture,
      matchedName: matchedName
    });
  }

  refreshTimeline = () => {
    var ts = Math.round((new Date()).getTime() / 1000);
    if((this.state.lastClicked + 5) < ts){
      this.setState({
        lastClicked: ts,
        requiresRefresh: true
      }, () => {this.getTimeline(false, 0)});
    }
  }

  setRequiresRefresh = () => {
    this.setState({
      requiresRefresh: true
    });
  }

  resetRequiresRefresh = () => {
    this.setState({
      requiresRefresh: false
    });
  }

  onSwipeLeft = (card) => {
    this.setState({
      full: false
    });
    if(true){
      var details = {
        "token": GLOBAL.authToken,
        "swipeid": card.userid,
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
            this.setState({
              previousCard: card
            });
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  handleNope = (card) => {
    this.onSwipeLeft(card);
  }

  handleYup = (card) => {
    this.onSwipeRight(card);
  }

  onSwipeRight = (card) => {
    this.setState({
      full: false
    });
    if(true){
      var details = {
        "token": GLOBAL.authToken,
        "swipeid": card.userid,
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
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var previousCard = "";
            if(responseJson.status != "success"){
              this.renderMatchedScreen(card);
            }
            else{
              previousCard = card;
            }
            this.setState({
              previousCard: previousCard
            })
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  onUndo = () => {
    if(this.state.previousCard != ""){
      this.setState({
        previousCard: ""
      })
      return true;
    }
    return false;
  }

  cardRemoved(index) {

    gotArtistData = false;
    this.setState({
      temp_spotifyData: []
    });

    const STOPPING_DELTA = 5500;


    var recent_swipe = (new Date()).getTime();
    swipe_time_array.push(recent_swipe);
    if(swipe_time_array.length > 6){
      swipe_time_array.shift();
    }

    if(swipe_time_array.length == 6){
      var first_swipe = swipe_time_array[0];
      if(recent_swipe - first_swipe <= STOPPING_DELTA){
        this.SlowDownSheet.open();
      }
    }

    let CARD_REFRESH_LIMIT = 5

    if (this.state.tuser.length - index <= CARD_REFRESH_LIMIT && !alreadyCalledTimeline) {


      alreadyCalledTimeline = true;

      this.getTimeline(false, (this.state.tuser.length - index) + 1);

    }
    if (this.state.tuser.length - index <= 0){
      this.setState({
        tuser: []
      })
    }
  }

  renderArtists = (artist_ids) => {
    var artistBubbles = [];
    if(this.state.temp_spotifyData.length > 0){
      for(var i = 0; i<this.state.temp_spotifyData.length; i++){
        artistBubbles.push(<SpotifyBubble key={this.state.temp_spotifyData[i].artist_id} name={this.state.temp_spotifyData[i].artist_name} image={this.state.temp_spotifyData[i].artist_image} />);
      }
      return artistBubbles;
    }
    else{
      var data = JSON.parse(artist_ids);
      if(!gotArtistData){
        gotArtistData = true;
        const artist_data = this.getArtists(JSON.parse(artist_ids));
      }

      return(<View></View>);
    }

  }

  getArtists = (data) => {
    var details = {
        "artist_1": data[0],
        "artist_2": data[1],
        "artist_3": data[2],
        "artist_4": data[3],
        "artist_5": data[4]
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/gsa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(Array.isArray(responseJson.artist_data)){
          this.setState({
            spotifyLoading: false,
            temp_spotifyData: responseJson.artist_data
          })
        }
        else{
          this.setState({
            spotifyLoading: false
          })
        }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  renderBadges = (badges_passed) => {
    var data = JSON.parse(badges_passed);
    var badges_to_render = [];
    for (var i = 0; i<data.length; i++) {
      badges_to_render.push(
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
          <ProfileBadge type={data[i]} />
          <Text style={{marginLeft: 10, fontSize: 20, color: "black", fontFamily: "Raleway-Medium"}}>{badges[data[i]].badge_name}</Text>
        </View>
      );
    }
    return(badges_to_render);
  }

  renderInterests = (interests) => {
    var data = JSON.parse(interests);
    var interests_to_return = [];
    for (var i = 0; i<data.length; i++) {
      interests_to_return.push(<InterestBubble disabled func={this.removeInterest} key={data[i]} interest={this.capitalizeFirstLetter(data[i])} />);
    }
    return (interests_to_return);
  }

  reportDialog = (userid, username) => {
      this.setState({
        reportUserDialog: true,
        report_userid: userid,
        report_username: username
      })
  }

  _cancelReport = () => {
    this.setState({
      reportUserDialog: false
    })
  }

  _report = () => {
    if(allowReportClick && this.state.reportUserMessage != ""){
      allowReportClick = false;
      var details = {
        "token": GLOBAL.authToken,
        "reported_userid": this.state.report_userid,
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
        "blockedid": this.state.report_userid,
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
            alert("There was an error blocking this user.");
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowBlockClick = true;
            this.references['cardstack']._forceLeftSwipe()
          }
        })
      .catch((error) => {
        allowBlockClick = true;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _handleReportText = (message) => {
    this.setState({
      reportUserMessage: message
    })
  }

  onDatingClick = () => {
    //GLOBAL.profile.firstname_display = undefined;
    if(this.state.matchingType != "dating"){
      if(GLOBAL.profile == undefined || GLOBAL.profile.firstname_display == undefined){
        this.setState({
          showRUMineDialog: true
        })
        return;
      }
      this.getTimeline(true, 0);
      if(cache.in_memory_cache !== undefined){
        cache.in_memory_cache['lastScreen'] = "dating";
      }
      this.setState({
        matchingType: "dating",
        showDatingTutorial: (GLOBAL.justMadeDatingProfile != true)?false:true
      });
      GLOBAL.justMadeDatingProfile = false;
    }
  }

  onGroupsClick = () => {
      if(GLOBAL.friends == undefined || GLOBAL.friends.firstname_display == undefined){
        this.setState({
          showGroupsDialog: true
        })
        return;
      }
      Actions.groups()
  }

  onFriendsClick = () => {
    if(this.state.matchingType != "friends"){
      if(GLOBAL.friends == undefined || GLOBAL.friends.firstname_display == undefined){
        this.setState({
          showRUFriendsDialog: true
        })
        return;
      }
      this.getFriendsTimeline([], true)
      if(cache.in_memory_cache !== undefined){
        cache.in_memory_cache['lastScreen'] = "friends";
      }
      this.setState({
        matchingType: "friends",
        showFriendsTutorial: (GLOBAL.justMadeFriendsProfile != true)?false:true
      });
      GLOBAL.justMadeFriendsProfile = false;
    }
  }

  _markUserAsSeen = (index) => {
    ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions);
    if(previousFriendSwipeIndex < index){
      //swiping in expected direction, mark index-1 as seen
      previousFriendSwipeIndex = index - 1;
      if((this.state.friendsTimeline.length - index < 3) && notCallingFriendsTimeline){
        notCallingFriendsTimeline = false;
        this.getFriendsTimeline([(this.state.friendsTimeline[this.state.friendsTimeline.length-5])?this.state.friendsTimeline[this.state.friendsTimeline.length-5].userid:null,(this.state.friendsTimeline[this.state.friendsTimeline.length-4])?this.state.friendsTimeline[this.state.friendsTimeline.length-4].userid:null,(this.state.friendsTimeline[this.state.friendsTimeline.length-3])?this.state.friendsTimeline[this.state.friendsTimeline.length-3].userid:null,(this.state.friendsTimeline[this.state.friendsTimeline.length-2])?this.state.friendsTimeline[this.state.friendsTimeline.length-2].userid:null,(this.state.friendsTimeline[this.state.friendsTimeline.length-1])?this.state.friendsTimeline[this.state.friendsTimeline.length-1].userid:null], false);
      }
      var pass = this;
      var details = {
        "token": GLOBAL.authToken,
        "userid": this.state.friendsTimeline[previousFriendSwipeIndex].userid
        };
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/ft/ms', {
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
            alert("There was an error. Please try again later.");
          }
          else{
            if(responseJson['token'] != "NA" && responseJson.error == null){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
    else{
      //swiped backwards, do nothing
    }
  }

  _renderFriendCard = ({item, index}) => {
    if(item.userid == "nomore"){
      return(
        <View style={{height: '100%', width: '100%', backgroundColor: 'white', justifyContent: "center", alignItems: "center"}}>
          <PenguinFriends style={{marginTop: 20, height: screenWidth*0.8, width: screenWidth*0.8}} />
          <View style={{marginLeft: 20, marginRight: 20}}>
            <Text style={{fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>It looks like you swiped through everybody!</Text>
            <Text style={{fontSize: 15, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>Come back later to find more friends!</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); addedNoMore=false; this.getFriendsTimeline([], false)}} style={{margin: 10, height: 40, width: 100, backgroundColor: '#5bb8ff', borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 15, color: "white", fontFamily: "Raleway-Medium"}}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else if(item.userid == "error"){
      return(
        <View style={{height: '100%', width: '100%', backgroundColor: 'white', justifyContent: "center", alignItems: "center"}}>
          <GoneFishing style={{marginTop: 20, height: screenWidth*0.8, width: screenWidth*0.8}} />
          <View style={{marginLeft: 20, marginRight: 20}}>
            <Text style={{fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Uh-oh! It looks like something went wrong.</Text>
            <Text style={{fontSize: 15, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>We'll call our penguins back from their fishing trip to get on it.</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); addedNoMore=false; this.getFriendsTimeline([], false)}} style={{margin: 10, height: 40, width: 100, backgroundColor: '#5bb8ff', borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 15, color: "white", fontFamily: "Raleway-Medium"}}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }
        return (
          <FriendProfileCard
            allowReport={true}
            topNotch={this.state.topNotchOffset}
            bottomNotch={this.state.bottomNotchOffset}
            bottomBarIsOpen={this.state.bottomBarIsOpen}
            userid={item.userid}
            requestSent={item.requesty_sent}
            firstname_display={item.firstname_display}
            pronouns={item.pronouns}
            year={item.year}
            program={item.program}
            top_5_spotify={item.top_5_spotify}
            badges={item.badges}
            classes={item.classes}
            interests={item.interests}
            bio={item.bio}
            images={(item.image3 == undefined || item.image3 == "null")?(item.image2 == undefined || item.image2 == "null")?(item.image1 == undefined || item.image1 == "null")?[item.image0]:[item.image0, item.image1]:[item.image0, item.image1, item.image2]:[item.image0, item.image1, item.image2, item.image3]}
           />
        );
    }

    dictateSizing = (forNavbar) => {
      if(Platform.OS == "android" && (this.state.bottomNotchOffset == 0)){
        if(forNavbar){
          return 55;
        }
        else{
          return screenHeight;
          //return (screenHeight-55)+24;
        }
      }
      else if(Platform.OS == "android"){
        if(forNavbar){
          return 55;
        }
        else{
          return screenHeight;
          //return (screenHeight-(55+this.state.bottomNotchOffset))+24;
        }
      }
      else if(this.state.bottomNotchOffset == 0){
        if(forNavbar){
          return 55;
        }
        else{
          return screenHeight-55;
        }
      }
      else{
        if(forNavbar){
          return 75;
        }
        else{
          return screenHeight-75
        }
      }
    }

  render() {
    console.disableYellowBox = true;

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      //
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "#f8f8ff"
      }}
      onLayout={(event) => this.getWindowDimension(event)}
      >
      <StatusBar
         barStyle={(this.state.matchingType == "dating")?"dark-content":"light-content"}  // Here is where you change the font-color
        />
        {(this.state.matchingType == "dating" && this.state.datingTimelineFail)?
        <View>
          <View style={{marginTop: 15, height: '100%', width: '100%', backgroundColor: 'white', justifyContent: "center", alignItems: "center"}}>
            <GoneFishing style={{height: screenWidth*0.8, width: screenWidth*0.8}} />
            <View style={{marginLeft: 20, marginRight: 20}}>
              <Text style={{fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Uh-oh! It looks like something went wrong.</Text>
              <Text style={{fontSize: 15, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>We'll call our penguins back from their fishing trip to get on it.</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.setState({datingTimelineFail: false}); this.refreshTimeline()}} style={{margin: 10, height: 40, width: 100, backgroundColor: '#ff5b99', borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
              <Text style={{fontSize: 15, color: "white", fontFamily: "Raleway-Medium"}}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
        :
        (this.state.matchingType == "dating")?
        <View>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
          <SwipeCards
            resetRequiresRefresh={() => this.resetRequiresRefresh()}
            setRequiresRefresh={() => this.setRequiresRefresh()}
            requiresRefresh={this.state.requiresRefresh}
            guid={"mainStack123"}
            loop={false}
            onRef={(ref) => {
              this.references['cardstack'] = ref;
            }}
            onClickHandler={() => {}}
            locked={this.state.full}
            cards={this.state.tuser}
            allowUndo={() => this.onUndo()}
            yupView={<View style={{height: 100, width: 100}}>
              <Icon name="heart" size={100} color="rgba(255, 91, 153, 0.8)" />
            </View>}
            yupStyle={{bottom: '15%', borderWidth: 0}}
            noView={<View style={{height: 100, width: 100}}>
              <Icon name="times" size={100} color="rgba(255, 91, 91, 0.8)" />
            </View>}
            nopeStyle={{bottom: '15%', borderWidth: 0}}
            renderCard={(cardData) =>
              <View style={{height: screenHeight, marginTop: this.state.topNotchOffset+10, backgroundColor: (this.state.full)?"white":"#f8f8ff"}}>
              <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} scrollEnabled={this.state.full}>
              <SwipeCard
                full={this.state.full}
                badges={cardData.badges}
                profile={() => {
                 return (
                   <ProfileInCard
                     preview={false}
                     recently_online={cardData.recently_online}
                     images={(cardData.image3 == undefined)?(cardData.image2 == undefined)?(cardData.image1 == undefined)?[cardData.image0]:[cardData.image0, cardData.image1]:[cardData.image0, cardData.image1, cardData.image2]:[cardData.image0, cardData.image1, cardData.image2, cardData.image3]}
                     allowClick={this.state.allowClick}
                     pass={this}
                     renderNextFunc={() => this.getMatch()}
                     userid={cardData.userid}
                     username={cardData.firstname_display}
                     birthdate={cardData.birthdate}
                     program={cardData.program}
                     year={cardData.year}
                     pronouns={cardData.pronouns}
                     lookingFor={cardData.lookingfor}
                     openFullProfile={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.setState({full: true})}}
                   />
                 )
               }}
              />
              {(this.state.full)?
                <View style={{elevation: 99999, minHeight: 200, height: 'auto', width: screenWidth, backgroundColor: "white", borderRadius: 15, top: -20}}>
                  {(cardData.bio && cardData.bio.length > 0)?
                      <View style={{height: 'auto', minHeight: screenWidth*0.15, width: screenWidth}}>
                        <View style={{padding: 20, justifyContent: "center"}}>
                          <Text style={{textAlign: "left", fontSize: 20, color: "black", fontFamily: "Raleway-Regular"}}>{cardData.bio}</Text>
                        </View>
                      </View>
                   :<View></View>}
                  {(cardData.badges && cardData.badges.length > 2)?
                    <View style={{width: screenWidth, justifyContent: "center", alignItems: "center", paddingTop: 20}}>
                    <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>A little about me...</Text>
                    <View style={{height: 'auto', width: 200, marginTop: 10, marginBottom: 10, justifyContent: "center"}}>
                      {this.renderBadges(cardData.badges)}
                    </View>
                   </View>
                  :<View></View>}
                  {(cardData.interests && cardData.interests.length > 2)?
                  <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
                    <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Interests are...</Text>
                    <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                      {this.renderInterests(cardData.interests)}
                    </View>
                  </View>
                 :
                 <View></View>
                 }
                 {(cardData.top_5_spotify && cardData.top_5_spotify.length > 4)?
                 <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
                   <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Top 5 Spotify Artists</Text>
                   <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                     {this.renderArtists(cardData.top_5_spotify)}
                   </View>
                 </View>
                :
                <View></View>
                }
                 <TouchableOpacity activeOpacity={0.8} onPress={() => this.reportDialog(cardData.userid, cardData.firstname_display)}
                   style={{paddingTop: 20, flexDirection: "row", height: 50, width: screenWidth, justifyContent: "center", alignItems: "center"}}>
                   <LineIcon style={{}} name="exclamation" size={25} color="red" />
                   <Text style={{fontSize: 20, fontFamily: "Raleway-Medium", color: "red"}}> Report or Block {cardData.firstname_display}</Text>
                 </TouchableOpacity>
                 <View style={{height: 220, width: screenWidth}}>
                 </View>
                </View>
                :
              <View></View>}
              {(this.state.full)?
                <TouchableOpacity activeOpacity={0.8} onPress={() => { ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.setState({full: false})}} style={{elevation: 99999, position: "absolute", height: 50, width: 50, top: screenHeight*0.675, right: 5, justifyContent: "center", alignItems: "center"}}>
                <Icon name="compress" size={35} color="white" />
              </TouchableOpacity>:<View></View>}
            </ScrollView></View>}
            renderNoMoreCards={() =>
              <View pointerEvents="box-none">
              <NoTimeline
                func={() => this.refreshTimeline()}
              />
              </View>}
            handleYup={this.handleYup}
            handleNope={this.handleNope}
            cardRemoved={this.cardRemoved.bind(this)}
          />
          </View>
        {(this.state.tuser.length > 0 && !this.state.matchScreenVisible)?
        <View pointerEvents={"box-none"} style={{width: screenWidth, justifyContent: 'center', flexDirection: "row", position: 'absolute', bottom: (this.state.bottomNotchOffset>0 && Platform.OS == "android")?90:(Platform.OS == "ios" && this.state.bottomNotchOffset > 0)?this.state.bottomNotchOffset + this.state.topNotchOffset + 40:(Platform.OS == "ios")?70:80}}>
          <View style={{paddingRight: 10, justifyContent: 'flex-end'}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.references['cardstack']._forceUndo()}} style={{height: 60, width: 60, borderRadius: 35, backgroundColor: "rgba(255, 186, 82, 1)", justifyContent: "center", alignItems: "center", shadowColor: '#000',
            shadowOffset: { width: 2, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 2}}>
              <Icon name="undo" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.references['cardstack']._forceRightSwipe()}} style={{height: 70, width: 70, borderRadius: 35, backgroundColor: "rgba(255, 91, 153, 1)", justifyContent: "center", alignItems: "center", shadowColor: '#000',
          shadowOffset: { width: 2, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 2}}>
            <Icon name="heart" size={30} color="white" />
          </TouchableOpacity>
          <View style={{paddingLeft: 10, justifyContent: 'flex-end'}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.references['cardstack']._forceLeftSwipe()}} style={{height: 60, width: 60, borderRadius: 30, backgroundColor: "rgba(255, 91, 91, 1)", justifyContent: "center", alignItems: "center", shadowColor: '#000',
          shadowOffset: { width: 2, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 2}}>
            <Icon name="times" size={25} color="white" />
          </TouchableOpacity>
          </View>
        </View>:<View></View>}
      </View>
      :
      <View style={{}}>
        <Carousel
          vertical
	        enableSnap={true}
	        disableIntervalMomentum={true}
	        shouldOptimizeUpdates
	        removeClippedSubviews={false}
          ref={(c) => { this._carousel = c; }}
          data={this.state.friendsTimeline}
          renderItem={this._renderFriendCard}
          sliderHeight={this.dictateSizing(false)}
          itemHeight={this.dictateSizing(false)}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          initialNumToRender={3}
          onSnapToItem={(index) => this._markUserAsSeen(index)}
        />
        {((this.props.firstTimeFriends && !this.state.accepted) || this.state.showFriendsTutorial)?
        <View style={{height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.75)', position: 'absolute', alignItems: "center", justifyContent: "center"}}>
          <View style={{margin: 10, alignItems: "center", justifyContent: "center"}}>
            <Text style={{textAlign: "center", fontSize: 25, color: "white", fontFamily: "Raleway-Bold"}}>Welcome to RU Friends.</Text>
            <VerticalScroll style={{marginTop: 10, height: 60, width: 60}} />
            <Text style={{fontSize: 15, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Swipe up to view profiles.</Text>
            <Text style={{marginTop: 15, textAlign: "center", fontSize: 15, color: "white", fontFamily: "Raleway-Medium"}}>Add friends by tapping the blue add friend bubble on the right.</Text>
            <Text style={{marginTop: 15, textAlign: "center", fontSize: 15, color: "white", fontFamily: "Raleway-Medium"}}>You can see your friends and requests by tapping the chat bubble at the top right.</Text>
            <Text style={{marginTop: 15, textAlign: "center", fontSize: 15, color: "white", fontFamily: "Raleway-Medium"}}>Your profile and preferences can be adjusted in your settings.</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {this.setState({showFriendsTutorial: false, accepted: true})}} style={{margin: 15, height: 40, width: 'auto', paddingLeft: 10, paddingRight: 10, backgroundColor: 'white', borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
              <Text style={{fontSize: 15, color: "black", fontFamily: "Raleway-Medium"}}>Start Finding Friends</Text>
            </TouchableOpacity>
          </View>
        </View>:<View></View>}
      </View>
      }
      <View style={{height: this.dictateSizing(true), width: '100%', position: "absolute", bottom: 0, backgroundColor: (this.state.matchingType == "dating")?"#cf2d6a":"#6970ff", flexDirection: "row"}}>
        <View style={{height: (this.state.bottomNotchOffset == 0 || this.state.bottomBarIsOpen || (!this.state.bottomBarIsOpen && this.state.bottomNotchOffset == 48))?'80%':'60%', width: '20%', justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.onDatingClick()} style={{height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
            <Icon name="heart" size={25} color={"white"} />
          </TouchableOpacity>
          <View style={{position: "absolute", bottom: 0, height: 5, width: 5, borderRadius: 5, backgroundColor: (this.state.matchingType == "dating")?"white":"transparent"}}>
          </View>
        </View>
        <View style={{height: (this.state.bottomNotchOffset == 0 || this.state.bottomBarIsOpen || (!this.state.bottomBarIsOpen && this.state.bottomNotchOffset == 48))?'80%':'60%', width: '20%', justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.onFriendsClick()} style={{height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
            <Icon name="users" size={25} color={"white"} />
          </TouchableOpacity>
          <View style={{position: "absolute", bottom: 0, height: 5, width: 5, borderRadius: 5, backgroundColor: (this.state.matchingType == "friends")?"white":"transparent"}}>
          </View>
        </View>
        <View style={{height: (this.state.bottomNotchOffset == 0 || this.state.bottomBarIsOpen || (!this.state.bottomBarIsOpen && this.state.bottomNotchOffset == 48))?'80%':'60%', width: '20%', justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.onGroupsClick()} style={{height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
            <Icon name="comments" size={30} color={"white"} />
          </TouchableOpacity>
        </View>
        <View style={{height: (this.state.bottomNotchOffset == 0 || this.state.bottomBarIsOpen || (!this.state.bottomBarIsOpen && this.state.bottomNotchOffset == 48))?'80%':'60%', width: '20%', justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.matches()} style={{height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
            <Icon5 name="comment-dots" size={25} color={"white"} />
            {(this.state.notifCount > 0)?<View style={{position: "absolute", bottom: 3, right: 3, height: 18, width: 18, borderRadius: 9, backgroundColor: "red", justifyContent: "center", alignItems: "center"}}>{(this.state.notifCount < 10)?<Text style={{color: "white", fontSize: 13}}>{this.state.notifCount}</Text>:<Text style={{color: "white", fontSize: 13}}>9+</Text>}</View>:<View></View>}
          </TouchableOpacity>
        </View>
        <View style={{height: (this.state.bottomNotchOffset == 0 || this.state.bottomBarIsOpen || (!this.state.bottomBarIsOpen && this.state.bottomNotchOffset == 48))?'80%':'60%', width: '20%', justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.settings()} style={{height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
            <View style={{height: 30, width: 30, borderRadius: 15, borderColor: "white", borderWidth: 2, overflow: "hidden"}}>
              <FastImage source={{uri: this.state.myPicture, priority: FastImage.priority.normal}}
                style={{height: 30, width: 30, borderRadius: 15, backgroundColor: "white"}}>
              </FastImage>
            </View>
          </TouchableOpacity>
        </View>
      </View>
        <View>
          <Dialog.Container visible={this.state.reportUserDialog}>
            <Dialog.Title>Report {this.state.report_username}</Dialog.Title>
            <Dialog.Description>
              Why are you reporting {this.state.report_username}?
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
          <RBSheet
            ref={ref => {
              this.SlowDownSheet = ref;
            }}
            closeOnPressMask={false}
            closeOnPressBack={false}
            height={screenHeight*0.4}
            openDuration={250}
            customStyles={{
              container: {
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25
              }
            }}
            >
              <View style={{height: screenHeight*0.3, width: screenWidth, alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {swipe_time_array=[]; this.SlowDownSheet.close()}} style={{position: "absolute", top: 0, right: 0, height: 50, width: screenWidth*0.35, borderRadius: 30, justifyContent: "center", alignItems: "center", backgroundColor: "white"}}>
                  <Text style={{fontSize: 16, textAlign: "center", color: (this.state.matchingType == "friends")?"#5bb8ff":"#ff5b99", fontFamily: "Raleway-Medium", textDecorationLine: "underline"}}>Sorry, Pippy!</Text>
                </TouchableOpacity>
                <Image source={slowdown} style={{marginTop: 70, height: 200, width: 200}}/>
              </View>
          </RBSheet>
       {(this.state.showRUFriendsDialog)?
       <View style={{height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.75)', position: 'absolute', alignItems: "center", justifyContent: "center"}}>
         <View style={{maxHeight: screenHeight*0.75, borderRadius: 20, backgroundColor: "white", width: screenWidth*0.9, alignItems: "center"}}>
           <View style={{height: screenHeight*0.25, width: '100%', backgroundColor: "white", borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
             <PenguinAndZebraSkating style={{height: '100%', width: '100%'}} />
           </View>
           <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
             <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
               <Text style={{textAlign: "center", fontSize: 18, color: "black", fontFamily: "Raleway-Bold"}}>RU Friends is here!</Text>
               <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Find students in your program, in the same classes, with the same interests, or that listen to the same artists. </Text>
               <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Create your friend profile now and start connecting, or try it out later by visiting the settings screen at any time.</Text>
             </View>
             <View style={{marginBottom: 10, width: '80%'}}>
               <TouchableOpacity activeOpacity={0.8} onPress={() => {ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions); this.migrateToFriends()}} style={{margin: 5, height: 'auto', padding: 15, width: '100%', backgroundColor: "#5bb8ff", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                 <Text style={{textAlign: "center", fontSize: 14, color: "white", fontFamily: "Raleway-Bold"}}>Create my Friends Profile</Text>
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.8} onPress={() => this.closeRUFriendsDialog()} style={{margin: 5, marginBottom: 10, height: 'auto', padding: 5, width: '100%', backgroundColor: "white", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                 <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Medium"}}>Dismiss</Text>
               </TouchableOpacity>
             </View>
           </ScrollView>
         </View>
       </View>:<View></View>}
       {(this.state.showGroupsDialog)?
       <View style={{height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.75)', position: 'absolute', alignItems: "center", justifyContent: "center"}}>
         <View style={{maxHeight: screenHeight*0.75, borderRadius: 20, backgroundColor: "white", width: screenWidth*0.9, alignItems: "center"}}>
           <View style={{height: screenHeight*0.25, width: '100%', backgroundColor: "white", borderTopRightRadius: 20, borderTopLeftRadius: 20, justifyContent: "center", alignItems: "center"}}>
             <GroupsSVG style={{height: '80%', width: '80%'}} />
           </View>
           <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
             <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
               <Text style={{textAlign: "center", fontSize: 18, color: "black", fontFamily: "Raleway-Bold"}}>Groups are here!</Text>
               <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Find, create, and connect with groups.</Text>
               <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Join your classmates in class groups, find new communities, and create your own groups with your friends. Share posts and chat in realtime.</Text>
               <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>It starts with a friends profile.</Text>
             </View>
             <View style={{marginBottom: 10, width: '80%'}}>
               <TouchableOpacity activeOpacity={0.8} onPress={() => {ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions); this.migrateToFriends()}} style={{margin: 5, height: 'auto', padding: 15, width: '100%', backgroundColor: "#5bb8ff", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                 <Text style={{textAlign: "center", fontSize: 14, color: "white", fontFamily: "Raleway-Bold"}}>Create my Friends Profile</Text>
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.8} onPress={() => this.closeGroupsDialog()} style={{margin: 5, marginBottom: 10, height: 'auto', padding: 5, width: '100%', backgroundColor: "white", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                 <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Medium"}}>Dismiss</Text>
               </TouchableOpacity>
             </View>
           </ScrollView>
         </View>
       </View>:<View></View>}
       {(this.state.showRUFriendsMigrate)?
       <View style={{height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.75)', position: 'absolute', alignItems: "center", justifyContent: "center"}}>
         <View style={{maxHeight: screenHeight*0.75, borderRadius: 20, backgroundColor: "white", width: screenWidth*0.9, alignItems: "center"}}>
           <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
             <View style={{marginTop: 15, marginLeft: 15, marginRight: 15, marginBottom: 15, justifyContent: "center", alignItems: "center"}}>
              <View>
                <Text style={{textAlign: "left", fontSize: 15, color: "black", fontFamily: "Raleway-Medium"}}>Hang on...</Text>
                <Text style={{textAlign: "left", fontSize: 20, color: "#5bb8ff", fontFamily: "Raleway-Bold"}}>We're creating your profile now.</Text>
              </View>
                <Text style={{marginTop: 10, textAlign: "center", fontSize: 16, color: "black", fontFamily: "Raleway-Medium"}}>We're moving this information from your dating profile:</Text>
              <View>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Name and Pronouns.</Text>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Program and Year.</Text>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Birthdate.</Text>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Interests.</Text>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Profile Badges.</Text>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Spotify Artists.</Text>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Bio.</Text>
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Main Image.</Text>
              </View>
              <Text style={{marginTop: 10, textAlign: "center", fontSize: 16, color: "black", fontFamily: "Raleway-Medium"}}>You'll have an opportunity to edit all of these in just a minute.</Text>
              </View>
             <View style={{marginBottom: 15, width: '80%'}}>
               <View style={{width: '100%', minHeight: 120, justifyContent: "center", alignItems: "center"}}>
                 {(this.state.friendsMigrationIsLoading)?
                   <View>
                     <ActivityIndicator size="large" color="#5bb8ff" />
                   </View>
                 :
                 <View style={{width: '100%', minHeight: 120, justifyContent: "center", alignItems: "center"}}>
                   <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.editfriendsprofile()} style={{margin: 5, height: 'auto', padding: 13, width: '100%', backgroundColor: "white", borderWidth: 2, borderColor: "#5bb8ff", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                     <Text style={{textAlign: "center", fontSize: 14, color: "#5bb8ff", fontFamily: "Raleway-Bold"}}>Make Edits to my Profile</Text>
                  </TouchableOpacity>
                   <TouchableOpacity activeOpacity={0.8} onPress={() => {this.setState({showRUFriendsMigrate: false, showFriendsTutorial: true}); GLOBAL.justMadeFriendsProfile = true; this.onFriendsClick()}} style={{margin: 5, height: 'auto', padding: 15, width: '100%', backgroundColor: "#5bb8ff", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                     <Text style={{textAlign: "center", fontSize: 14, color: "white", fontFamily: "Raleway-Bold"}}>Start Finding Friends</Text>
                   </TouchableOpacity>
                 </View>}
               </View>
             </View>
           </ScrollView>
         </View>
       </View>:<View></View>}
       {(this.state.showRUMineDialog)?
       <View style={{height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.75)', position: 'absolute', alignItems: "center", justifyContent: "center"}}>
         <View style={{maxHeight: screenHeight*0.75, borderRadius: 20, backgroundColor: "white", width: screenWidth*0.9, alignItems: "center"}}>
           <View style={{height: screenHeight*0.25, width: '100%', backgroundColor: "white", borderTopRightRadius: 20, borderTopLeftRadius: 20, justifyContent: "center", alignItems: "center"}}>
             <DatingPenguins style={{height: '80%', width: '100%'}} />
           </View>
           <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
             <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
               <Text style={{textAlign: "center", fontSize: 18, color: "black", fontFamily: "Raleway-Bold"}}>RU Mine Dating</Text>
               <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Connect and match with other students from your school, exclusively.</Text>
               <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Create your dating profile now and start matching, or try it out later by visiting the settings screen at any time.</Text>
             </View>
             <View style={{marginBottom: 10, width: '80%'}}>
               <TouchableOpacity activeOpacity={0.8} onPress={() => {ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions); Actions.createDatingProfileFromFriends()}} style={{margin: 5, height: 'auto', padding: 15, width: '100%', backgroundColor: "#ff5b99", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                 <Text style={{textAlign: "center", fontSize: 14, color: "white", fontFamily: "Raleway-Bold"}}>Create my Dating Profile</Text>
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.8} onPress={() => this.closeRUMineDialog()} style={{margin: 5, marginBottom: 10, height: 'auto', padding: 5, width: '100%', backgroundColor: "white", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                 <Text style={{marginTop: 10, textAlign: "center", fontSize: 15, color: "black", fontFamily: "Raleway-Medium"}}>Dismiss</Text>
               </TouchableOpacity>
             </View>
           </ScrollView>
         </View>
       </View>:<View></View>}
       {((this.props.firstTime && !this.state.accepted) || this.state.showDatingTutorial)?
         <FirstTime
           func={() => this.acceptFirstTime()}
          />
         :
         <View></View>
       }
       {(this.state.matchScreenVisible)?
         <MatchScreen
           picture={this.state.matchedPicture}
           username={this.state.matchedName}
           func={() => this.setState({matchScreenVisible: false})}
          />
         :
         <View></View>
       }
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
;
