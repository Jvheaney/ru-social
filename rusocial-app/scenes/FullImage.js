import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Actions } from 'react-native-router-flux';
//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Profile from '../components/Profile';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

import FastImage from 'react-native-fast-image'
import navlogo from '../assets/images/NBF.png';

class Swipe extends Component {

  state = {
    pictureLoading: false,
    width: 0,
    height: 0
  }

  onLoadStart = () => {
    this.setState({pictureLoading: true})
    Image.getSize(this.props.image, (width, height) => {this.setState({width, height})});
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <SafeAreaView style={{
        flex:1,
        backgroundColor: "white"
      }}>
      <View style={{
        flex: 1,
        height: screenHeight-50,
        width: screenWidth,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={25} color="black" /></TouchableOpacity>
        <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
      </View>
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
        <ImageZoom cropWidth={screenWidth}
                       cropHeight={screenHeight-100}
                       imageWidth={screenWidth}
                       imageHeight={screenHeight-100}>
          <FastImage onLoadStart={() => this.onLoadStart()} onLoadEnd={() => this.setState({pictureLoading: false})} source={{uri: this.props.image, priority: FastImage.priority.normal}} resizeMode={FastImage.resizeMode.contain} style={{justifyContent: "center", alignItems: "center", height: '100%', width: screenWidth}}>
            {(this.state.pictureLoading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
          </FastImage>
        </ImageZoom>
      </View>
      </SafeAreaView>

   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
