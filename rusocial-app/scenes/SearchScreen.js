import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import SearchResultItem from '../components/SearchResultItem';

import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';
import cache from '../in_memory_cache.js';


import navlogo from '../assets/images/NBF.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let lastTyped = 0;


class Swipe extends Component {

  componentDidMount() {
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  search = () => {
    var details = {
      "token": GLOBAL.authToken,
      "search_query": this.state.query,
      "search_type": this.props.searchType
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");


    return fetch('https://rumine.ca/_apiv2/gw/ft/search', {
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
          alert("We could not make that search for you. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          this.setState({
            results: responseJson.data,
            loadingSearch: false
          });
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  _sendSearch = () => {
    if(new Date().getTime() - lastTyped > 485){
      if(this.state.query.length > 0){
        this.search();
      }
    }
  }

  cleanSmartPunctuation = (value) => {
    if(value != null){
      return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
    }
    else{
      return "";
    }
  }

  _handleSearchChange = (query) => {
    var timmed_query = this.cleanSmartPunctuation(query).trim();
    this.setState({
      loadingSearch: (timmed_query.length>0),
      query: query
    });
    if(timmed_query.length > 0){
      lastTyped = new Date().getTime();
      var pass = this;
      setTimeout(function(){
        pass._sendSearch()
      }, 500);
    }
  }


  state = {
    results: [],
    query: "",
    loadingSearch: false
    }

  renderSearchResults = () => {
    if(this.state.results.length == 0 && this.state.query.length > 0){
      return(
        <View style={{height: 50, width: '100%', justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontSize: 14, textAlign: "center", color: "black", fontFamily: "Raleway-Regular"}}>No results.</Text>
        </View>
      );
    }
    else if(this.state.results.length == 0){
      return(
        <View>
        </View>
      );
    }
  return this.state.results.map((result) => {
      return (
        <SearchResultItem key={result.userid + result.groupid} type={result.type} userid={result.userid} groupid={result.groupid} name={result.name} firstname_display={result.firstname_display} lastname={result.lastname} isPrivate={result.isPrivate} isGroupAdmin={result.isGroupAdmin} isMember={result.isMember} image={(result.image0==undefined || result.image0==null)?result.image:result.image0} friends={result.friends} requested={result.requested} />
      )
    });
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{
        flex:1}}>
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
        //Symbols like $ breaks the search
        //Entering " " breaks the search
        //Speed up searching
        />
        <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Search</Text>
          <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
          </View>
        </View>
        <View style={{justifyContent: "center", margin: 5, marginLeft: 15, marginRight: 15}}>
        <TextInput
          placeholder={(this.props.searchType == 0)?"Who are you looking for?":"What are you looking for?"}
          value={this.state.query}
          placeholderTextColor="#aaaaaa"
          style={{color: "black", padding: 8, fontSize: 18, backgroundColor: "#cecece", borderRadius: 20}}
          multiline={false}
          maxLength={128}
          onChangeText={(query) => this._handleSearchChange(query)}
          >
          </TextInput>
        </View>
        {(!this.state.loadingSearch)?
          <ScrollView>
            {this.renderSearchResults()}
            <View style={{height: 100, width: '100%', justifyContent: "center", alignItems: "center"}}>
              {(this.state.results.length > 0)?
                <Text style={{fontSize: 14, textAlign: "center", color: "black", fontFamily: "Raleway-Regular"}}>Showing the top {this.state.results.length} {(this.state.results.length > 1)?"results":"result"}.</Text>
                :
                <View></View>
              }
            </View>
          </ScrollView>
        :<View>
          <ActivityIndicator size={"small"} color={"black"} />
        </View>}
      </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
