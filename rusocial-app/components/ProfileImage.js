import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image'



let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Swipe extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View>
        <FastImage source={{uri: "https://rumine.ca/_i/s/i.php?i=" + this.props.image, priority: FastImage.priority.high}} style={{height: 180, width: (screenWidth/(screenHeight*0.75))*180, backgroundColor: "#cecece", borderRadius: 20}}>
          <View style={{height: '100%', width: '100%', justifyContent: "center", alignItems: "center"}}>
            {(this.props.loading)?<ActivityIndicator color={(this.props.friends)?"#5bb8ff":"#ff5b99"} size={"small"} />:<View></View>}
          </View>
        </FastImage>
        <View style={{position: "absolute", top: -5, left: -5, height: 35, width: 35, borderRadius: 12, backgroundColor: (this.props.friends)?"#5bb8ff":"#ff5b99", justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>{this.props.index}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.6} onPress={(this.props.image !== undefined)?this.props.onRemoveImage:this.props.onAddImage} style={{position: "absolute", bottom: -5, right: -5, height: 36, width: 36, borderRadius: 18, borderColor: (this.props.friends)?"#5bb8ff":"#ff5b99", borderWidth: 2, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
          <View style={{paddingLeft: 1, paddingTop: 1}}><FAIcon name={(this.props.image !== undefined && this.props.image !== null)?"trash":"plus"} color={(this.props.friends)?"#5bb8ff":"#ff5b99"} size={20} /></View>
        </TouchableOpacity>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
