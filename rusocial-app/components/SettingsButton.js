import React, {Component} from 'react';
import { Modal, SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

import EvilIcons from 'react-native-vector-icons/EvilIcons';

import TitleText from '../elements/TitleText';

class TextPost extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View>
      <TouchableOpacity activeOpacity={0.7} onPress={this.props.func} style={{padding: 10, width: screenWidth}}>
        <View style={{alignItems: "center", flexDirection: "row", height: 'auto', width: screenWidth-20, borderRadius: 15, backgroundColor: "white"}}>
          <View style={{height: 'auto', width: (screenWidth-20)/12, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
            <EvilIcons name={this.props.icon} size={30} color={"#6970ff"} />
          </View>
          <View style={{padding: 5, height: 'auto', width: ((screenWidth-20)/6)*5, justifyContent: "center"}}>
            <TitleText size={20} text={this.props.message} />
          </View>
        </View>
      </TouchableOpacity>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default TextPost;
