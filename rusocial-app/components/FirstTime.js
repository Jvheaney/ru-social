import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



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
      <View style={{position: "absolute", height: screenHeight, width: screenWidth, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center"}}>
      <LineIcon name="check" size={100} color="#cf2d6a" />
       <Text style={{textAlign: "center", paddingTop: 10,  color: "#cf2d6a", fontSize: 30, fontFamily: "Raleway-Bold"}}>You're ready to go!</Text>
       <Text style={{textAlign: "center", paddingTop: 5, color: "black", fontSize: 25, fontFamily: "Raleway-Regular"}}>Your profile is now live.</Text>
       <Text style={{textAlign: "center", paddingTop: 25, color: "black", fontSize: 18, paddingLeft: 5, paddingRight: 5, fontFamily: "Raleway-Regular"}}>Click the gear icon at the top left to edit your profile at any time.</Text>
       <Text style={{textAlign: "center", paddingTop: 20, color: "black", fontSize: 18, paddingLeft: 5, paddingRight: 5, fontFamily: "Raleway-Regular"}}>See your matches by clicking the icon at the top right.</Text>
       <Text style={{textAlign: "center", paddingTop: 20, color: "black", fontSize: 18, paddingLeft: 5, paddingRight: 5, fontFamily: "Raleway-Regular"}}>Tap the left/right side of a user's card to see their pictures. Click the center or their name to open their full profile.</Text>
       <View style={{height: 'auto', paddingTop: 20, width: screenWidth, alignItems: "center"}}>
         <TouchableOpacity onPress={this.props.func} activeOpacity={0.8} style={{width: screenWidth*0.8, backgroundColor: "#cf2d6a", borderRadius: 10}}>
           <Text style={{padding: 10, textAlign: "center", color: "white", fontSize: 30, fontFamily: "Raleway-Regular"}}>Get matching!</Text>
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
