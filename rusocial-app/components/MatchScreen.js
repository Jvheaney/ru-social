import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

import FastImage from 'react-native-fast-image'


class Swipe extends Component {

  state = {
    reportUserDialog: false,
    reportUserMessage: ""
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

  _report = () => {
    alert("reported");
    Actions.pop();
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

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{position: "absolute", height: screenHeight, width: screenWidth, backgroundColor: "rgba(207, 45, 106,0.9)", alignItems: "center"}}>
       <View style={{position: "absolute", height: 'auto', top: -(screenWidth*1.25)/30, left: -(screenWidth*1.25)/8, width: screenWidth, alignItems: "center", shadowColor: '#000',
       shadowOffset: { width: 5, height: 5 },
       shadowOpacity: 0.2,
       shadowRadius: 5,
       elevation: 2}}>
         <FastImage source={{uri: this.props.picture, priority: FastImage.priority.normal}} style={{height: screenWidth*1.25, width: screenWidth*1.25, borderRadius: (screenWidth*1.25)/2, backgroundColor: "white"}}></FastImage>
       </View>
       <View style={{position: "absolute", backgroundColor: "white", height: screenWidth*1.5, width: screenWidth*1.5, borderRadius: screenWidth, bottom: -screenWidth*0.8}}>
         <Text style={{top: 30, textAlign: "center", color: "#cf2d6a", fontSize: 30, fontFamily: "Raleway-Bold"}}>It's a match!</Text>
         <Text style={{top: 30, textAlign: "center", color: "black", fontSize: 50, fontFamily: "Raleway-Regular"}}>{this.props.username}</Text>
       </View>
       <View style={{position: "absolute", backgroundColor: "rgba(207, 45, 106,0.9)", height: screenWidth, width: screenWidth, borderRadius: screenWidth/2, bottom: -screenWidth/1.35, alignItems: "center"}}>
          <TouchableOpacity onPress={this.props.func} activeOpacity={0.95}  style={{borderWidth: 5, borderColor: "#cf2d6a", height: 120, width: 120, top: -55, backgroundColor: "white", borderRadius: 60, justifyContent: "center", alignItems: "center"}}>
            <Text style={{padding: 10, textAlign: "center", color: "#cf2d6a", fontSize: 20, fontFamily: "Raleway-Bold"}}>Keep Swiping</Text>
          </TouchableOpacity>
       </View>
     </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
