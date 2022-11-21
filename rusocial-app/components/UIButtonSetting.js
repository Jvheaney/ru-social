import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class MatchListItem extends Component {

  state = {

  }

  render() {
    console.disableYellowBox = true;

    return (
      <View style={{margin: 5, width:'auto', height: 'auto', justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity activeOpacity={0.8} onPress={this.props.func} style={{height: 60, width: screenWidth*0.4, backgroundColor: this.props.buttonColor, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
          <Text style={{textAlign:"center", paddingRight: 10, paddingLeft: 10 ,color: "white", fontSize: 18, fontFamily: "Raleway-Regular"}}>{this.props.option}</Text>
        </TouchableOpacity>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default MatchListItem;
