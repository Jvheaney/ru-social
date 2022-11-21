import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ADIcon from 'react-native-vector-icons/AntDesign';

import MatchListItem from '../components/MatchListItem';
import RecentConnectionItem from '../components/RecentConnectionItem';
import NewMatchIcon from '../components/NewMatchIcon';

import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';


import navlogo from '../assets/images/NBF.png';
import cache from '../in_memory_cache.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class Swipe extends Component {

  componentDidMount() {
    this.getConversations();
    this.getRequestCount();
    this.getRecentConnections();
  }

  componentWillReceiveProps(){
    this.getConversations();
    this.getRequestCount();
    this.getRecentConnections();
  }

  componentWillUnmount() {
    GLOBAL.fromMatches = true;
    setTimeout(function() {Actions.refresh({refresh: true})}, 500);
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  getRecentConnections = () => {
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


    return fetch('https://rumine.ca/_apiv2/gw/m/grc', {
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
          alert("We could not get your conversations right now. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
            cache.in_memory_cache = {};
          }
          cache.in_memory_cache['recent_connections'] = responseJson.data;
          this.setState({
            recentConnections: responseJson.data
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  getConversations = () => {
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


    return fetch('https://rumine.ca/_apiv2/gw/m/gc', {
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
          alert("We could not get your conversations right now. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
            cache.in_memory_cache = {};
          }
          cache.in_memory_cache['messages_screen'] = responseJson.data;
          this.setState({
            conversations: responseJson.data
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  getRequestCount = () => {
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


    return fetch('https://rumine.ca/_apiv2/gw/ft/gfrc', {
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
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
            cache.in_memory_cache = {};
          }
          cache.in_memory_cache['request_count'] = JSON.parse(responseJson.status);
          this.setState({
            requestCount: JSON.parse(responseJson.status)
          })
        }
      })
      .catch((error) => {
      });
  }


  state = {
    conversations: (cache.in_memory_cache && cache.in_memory_cache['messages_screen'])?cache.in_memory_cache['messages_screen']:[],
    requestCount: (cache.in_memory_cache && cache.in_memory_cache['request_count'])?cache.in_memory_cache['request_count']:0,
    recentConnections: (cache.in_memory_cache && cache.in_memory_cache['recent_connections'])?cache.in_memory_cache['recent_connections']:[]
    }

    renderRecentConnections = () => {
    return this.state.recentConnections.map((recent) => {
        return (
          <RecentConnectionItem key={'RC_' + recent.userid} type={recent.type} userid={recent.userid} avatar={recent.image0} name={recent.firstname_display} />
        )
      });
    }

  renderConversations = () => {
    if(this.state.conversations.length == 0){
      return(
        <View style={{height: 50, width: '100%', justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontSize: 14, textAlign: "center", color: "gray", fontFamily: "Raleway-Regular"}}>You have no active conversations.</Text>
        </View>
      );
    }
  return this.state.conversations.map((match) => {
      return (
        <MatchListItem key={match.matchid} type={match.type} group_fname={match.group_fname} userid={match.userid} matchid={match.matchid} avatar={match.data} time_sent={match.time_sent} name={match.name} message={match.message} read={match.read} sent={(match.sentby == "me")} />
      )
    });
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{height: screenHeight, width: screenWidth, backgroundColor: "white"}}>
      <SafeAreaView style={{
        backgroundColor: "white"
      }}></SafeAreaView>
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
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Messages</Text>
          <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
            <TouchableOpacity style={{height: 35, width: 35, alignItems: "center", justifyContent: "center"}} activeOpacity={0.4} onPress={() => Actions.searchScreen({"searchType":0})}><FAIcon style={{}} name="search" size={20} color="black" /></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.4} onPress={() => Actions.contacts()} style={{height: 35, width: 35, alignItems: "center", justifyContent: "center"}}>
              <ADIcon style={{}} name="contacts" size={25} color="black" />
              {(this.state.requestCount > 0)?
              <View style={{position: "absolute", bottom: 4, right: 4, backgroundColor: "red", height: 15, width: 15, borderRadius: 10}}>
                <Text style={{fontSize: 10, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>{(this.state.requestCount<10)?this.state.requestCount:"9+"}</Text>
              </View>:<View></View>}
            </TouchableOpacity>
            <TouchableOpacity style={{height: 35, width: 35, alignItems: "center", justifyContent: "center"}} activeOpacity={0.4} onPress={() => this.setState({openMenu: !this.state.openMenu})}><LineIcon style={{}} name="options-vertical" size={20} color="black" /></TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {(this.state.recentConnections.length > 0)?
          <View>
            <Text style={{fontSize: 18, marginLeft: 10, marginTop: 5, marginBottom: 5, textAlign: "left", color: "black", fontFamily: "Raleway-Medium"}}>Recently Connected</Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{height: 'auto', width: screenWidth, backgroundColor: "white"}}>
              { this.renderRecentConnections() }
            </ScrollView></View>:<View></View>}

          <Text style={{fontSize: 18, marginLeft: 10, marginTop: 5, textAlign: "left", color: "black", fontFamily: "Raleway-Medium"}}>Conversations</Text>
          <View style={{height: 'auto', width: screenWidth, backgroundColor: 'white'}}>
            { this.renderConversations() }
          </View>
          <View style={{height: 75, width: screenWidth}}></View>
        </ScrollView>
        {(this.state.openMenu)?
        <View style={{position: "absolute", height: '100%', width: '100%', backgroundColor: 'transparent'}}>
          <TouchableOpacity activeOpacity={0} onPress={() => this.setState({openMenu: false})} style={{height: '100%', width: '100%', backgroundColor: 'transparent'}}>
          </TouchableOpacity>
          <View style={{position: "absolute", top: 50, right: 0, height: 'auto', width: 200, backgroundColor: "white", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 2}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {this.setState({ openMenu: false }); Actions.sentRequests();}} style={{height: 45, width: 'auto', flexDirection: "row", alignItems: "center"}}>
              <LineIcon style={{paddingLeft: 10, paddingTop: 5}} name="envelope" size={15} color="black" />
              <Text style={{fontSize: 15, paddingLeft: 5, paddingTop: 15, paddingBottom: 15, color: "black", fontFamily: "Raleway-Bold"}}>Sent Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {this.setState({ openMenu: false }); Actions.blockedUsers()}} style={{height: 45, width: 'auto', flexDirection: "row", alignItems: "center"}}>
              <LineIcon style={{paddingLeft: 10, paddingTop: 5}} name="ban" size={15} color="black" />
              <Text style={{fontSize: 15, paddingTop: 15, paddingBottom: 15, paddingLeft: 5, color: "black", fontFamily: "Raleway-Bold"}}>Blocked Users</Text>
            </TouchableOpacity>
          </View>
        </View>:<View></View>}
      </View>
    </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
