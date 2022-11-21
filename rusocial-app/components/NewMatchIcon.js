import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
//import Dialog from "react-native-dialog";
//import Shimmer from 'react-native-shimmer';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class MatchListItem extends Component {

  state = {

  }

  renderMessage = () => {
    if(this.props.message.length > 47){
      return this.props.message.substring(0,47) + "...";
    }
    else{
      return this.props.message
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
          <TouchableOpacity style={{margin: 5, marginBottom: 10}} activeOpacity={0.8} onPress={() => Actions.matchConvo({matchid: this.props.matchid, avatar: this.props.avatar, username: this.props.name, userid: this.props.userid})} >
            <View style={{height: screenWidth*0.24, backgroundColor: "#ff5b99", borderRadius: screenWidth*0.05, flexDirection: "column", alignItems: "center", justifyContent: "center",  shadowColor: '#000',
            shadowOffset: { width: 2, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 2}}>
              <View style={{minHeight: screenWidth*0.20, borderRadius:screenWidth*0.05, height: 'auto', width: screenWidth*0.20, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                <FastImage source={{uri: this.props.avatar, priority: FastImage.priority.normal}} style={{height: screenWidth*0.20, width: screenWidth*0.25, borderRadius: screenWidth*0.05, backgroundColor: "white"}}></FastImage>
              </View>
              <Text numberOfLines={1} style={{fontSize: 14, width: screenWidth*0.25, paddingBottom: 5, textAlign: "center", color: "white", fontFamily: "Raleway-Light"}}>{this.props.name}</Text>
            </View>
          </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default MatchListItem;
