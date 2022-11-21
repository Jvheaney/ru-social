import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import * as RNLocalize from "react-native-localize";
import moment from 'moment-timezone';
//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome'

import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'
import groupimage from '../assets/images/group.jpg';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class GroupListItem extends Component {

  state = {

  }

  render() {
    console.disableYellowBox = true;

    return (
          <TouchableOpacity style={{shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 1}} activeOpacity={0.8} onPress={() => {Actions.createGroup()}} >
            <View style={{backgroundColor: "white", height: 200, width: screenWidth*0.4, marginLeft: (screenWidth*0.2)/3, marginTop: 10, marginBottom: 10, borderRadius: 20, borderWidth: 2, borderColor:"black", alignItems: "center", justifyContent: "center"}}>
                <Icon style={{}} name="plus" size={40} color="black" />
                <View style={{marginTop: 10, height: 'auto', maxHeight: 75, justifyContent: "center"}}>
                  <Text numberOfLines={2} style={{fontSize: 16, paddingLeft: 5, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>Create your Group</Text>
                </View>
            </View>
          </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default GroupListItem;
