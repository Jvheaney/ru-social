import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import RequestedFriend from '../components/RequestedFriend';
import FriendItem from '../components/FriendItem';
import MatchItem from '../components/MatchItem';

import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';
import cache from '../in_memory_cache.js';


import navlogo from '../assets/images/NBF.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class Swipe extends Component {

  componentDidMount() {
    this.getPendingRequests();
    this.getFriends();
    this.getMatches();
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  getPendingRequests = () => {
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


    return fetch('https://rumine.ca/_apiv2/gw/ft/gmr', {
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
          alert("We could not get your pending requests right now. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
            cache.in_memory_cache = {};
          }
          cache.in_memory_cache['pending_requests'] = responseJson.status;
          this.setState({
            requests: responseJson.status
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  getFriends = () => {
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


    return fetch('https://rumine.ca/_apiv2/gw/ft/gaf', {
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
          alert("We could not get your pending requests right now. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
            cache.in_memory_cache = {};
          }
          cache.in_memory_cache['friends'] = responseJson.status;
          this.setState({
            friends: responseJson.status
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  getMatches = () => {
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


    return fetch('https://rumine.ca/_apiv2/gw/m/gm', {
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
          alert("We could not get your pending requests right now. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
            cache.in_memory_cache = {};
          }
          cache.in_memory_cache['matches'] = responseJson.data;
          this.setState({
            matches: responseJson.data
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }


  state = {
    requests: (cache.in_memory_cache && cache.in_memory_cache['pending_requests'])?cache.in_memory_cache['pending_requests']:[],
    friends: (cache.in_memory_cache && cache.in_memory_cache['friends'])?cache.in_memory_cache['friends']:[],
    matches: (cache.in_memory_cache && cache.in_memory_cache['matches'])?cache.in_memory_cache['matches']:[]
  }

  renderFriendRequests = () => {
  if(this.state.requests.length == 0){
    return(
      <View style={{height: 50, width: '100%', justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontSize: 14, textAlign: "center", color: "black", fontFamily: "Raleway-Regular"}}>You have no pending friend requests.</Text>
      </View>
    );
  }
  return this.state.requests.map((request) => {
      return (
        <RequestedFriend key={request.userid} pass={this} userid={request.userid} firstname_display={request.firstname_display} image={request.image0} />
      )
    });
  }

  renderFriends = () => {
    if(this.state.friends.length == 0){
      return(
        <View style={{height: 50, width: '100%', justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontSize: 14, textAlign: "center", color: "black", fontFamily: "Raleway-Regular"}}>You haven't added any friends yet.</Text>
        </View>
      );
    }
    return this.state.friends.map((request) => {
        return (
          <FriendItem key={request.userid} pass={this} userid={request.userid} firstname_display={request.firstname_display} image={request.image0} />
        )
      });
  }

  renderMatches = () => {
    if(this.state.matches.length == 0){
      return(
        <View style={{height: 50, width: '100%', justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontSize: 14, textAlign: "center", color: "black", fontFamily: "Raleway-Regular"}}>You haven't matched with anyone yet.</Text>
        </View>
      );
    }
    return this.state.matches.map((request) => {
        return (
          <MatchItem key={request.userid} matchid={request.matchid} pass={this} userid={request.userid} firstname_display={request.name} image={request.data} />
        )
      });
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{flex:1}}>
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
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Contacts</Text>
          <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
          </View>
        </View>
        <ScrollView>
          <View style={{marginLeft: 15, marginTop: 20, flexDirection: "row", alignItems: "center"}}>
            <FAIcon name="envelope" size={15} color="#5bb8ff" family={"FontAwesome"} />
            <Text style={{paddingLeft: 5, fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>Friend Requests</Text>
          </View>
          {this.renderFriendRequests()}
          <View style={{marginLeft: 15, marginTop: 20, flexDirection: "row", alignItems: "center"}}>
            <FAIcon name="users" size={15} color="#5bb8ff" family={"FontAwesome"} />
            <Text style={{paddingLeft: 5, fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>Friends</Text>
          </View>
          {this.renderFriends()}
          <View style={{marginLeft: 15, marginTop: 20, flexDirection: "row", alignItems: "center"}}>
            <FAIcon name="heart" size={15} color="#ff5b99" family={"FontAwesome"} />
            <Text style={{paddingLeft: 5, fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>Matches</Text>
          </View>
          {this.renderMatches()}
          <View style={{height: 50, width: '100%'}}></View>
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
