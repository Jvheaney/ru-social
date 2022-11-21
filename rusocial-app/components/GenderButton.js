import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";



let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class Swipe extends Component {

  state = {

  }

  render() {
    console.disableYellowBox = true;

    return (
      //
    <View style = {{height: 'auto', flexDirection:"row"}}>

       <TouchableOpacity activeOpacity={0.8} onPress={this.props.func} style={{padding: 10, height: 70, width: screenWidth, alignItems: "center"}}>
       
        <View style={{height: 50, width: screenWidth-80, backgroundColor: (this.props.selected)?"#ff5b99":"white", borderRadius: 20, borderWidth: 3, borderColor: (this.props.selected)?"#ff5b99":"#f78cb4", justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontSize: 20, textAlign: "center", color: (this.props.selected)?"white":"black", fontFamily: "Raleway-Regular"}}>{this.props.gender}</Text>
       </View>

      </TouchableOpacity>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
