import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ADIcon from 'react-native-vector-icons/AntDesign';

import GroupListItem from '../components/GroupListItem';
import CreateGroupPrompt from '../components/CreateGroupPrompt';
import SearchGroupPrompt from '../components/SearchGroupPrompt';
import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';


import navlogo from '../assets/images/NBF.png';
import cache from '../in_memory_cache.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class Swipe extends Component {

  componentDidMount() {
    this.getGroups();
  }

  componentWillReceiveProps(){
    this.getGroups();
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  getGroups = () => {
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


    return fetch('https://rumine.ca/_apiv2/g/u', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,

    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status == "fail" && responseJson.reason == "Token failed"){
          Actions.replace("login");
        }
        else if(responseJson.status == "fail" && responseJson.reason == "server-error"){
          if(responseJson.token){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("We could not get your conversations right now. Please try again later.");
        }
        else{
          if(responseJson.token){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(cache.in_memory_cache == undefined || cache.in_memory_cache == null){
            cache.in_memory_cache = {};
          }
          var groups = JSON.parse(responseJson.data);
          cache.in_memory_cache['groups_screen'] = groups;
          this.setState({
            groups: groups
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }


  state = {
    groups: (cache.in_memory_cache && cache.in_memory_cache['groups_screen'])?cache.in_memory_cache['groups_screen']:[],
    }

  renderGroups = () => {
    if(this.state.groups.length == 0){
      return(
        <>
        <SearchGroupPrompt key={'SearchGroupPrompt'} />
        <CreateGroupPrompt key={'createGroupPrompt'} />
        </>
      );
    }
  return this.state.groups.map((group, index) => {
      if(index + 1 == this.state.groups.length){
        return (
            <>
              <GroupListItem key={group.groupid} isPrivate={group.isPrivate} groupid={group.groupid} avatar={group.image} name={group.name} isGroupAdmin={group.isGroupAdmin} />
            </>
        )
      }
      else{
        return (
          <GroupListItem key={group.groupid} isPrivate={group.isPrivate} groupid={group.groupid} avatar={group.image} name={group.name} isGroupAdmin={group.isGroupAdmin} />
        )
      }
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
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>My Groups</Text>
          <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
            <TouchableOpacity style={{height: 35, width: 35, alignItems: "center", justifyContent: "center"}} activeOpacity={0.4} onPress={() => Actions.searchScreen({"searchType":1})}><FAIcon style={{}} name="search" size={20} color="black" /></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.4} onPress={() => Actions.createGroup()} style={{height: 35, width: 35, alignItems: "center", justifyContent: "center"}}>
              <FAIcon style={{}} name="plus" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={{height: 'auto', width: screenWidth, backgroundColor: 'white', flexDirection: "row", flexWrap: "wrap"}}>
            { this.renderGroups() }
          </View>
          <View style={{height: 75, width: screenWidth}}></View>
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
