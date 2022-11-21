import React, {Component} from 'react';
import { Modal, SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome5';


import TitleText from '../elements/TitleText';
import { imageURL } from '../utilities/Connector';
import global from '../utilities/global';

class TextPost extends Component {

  _handlePress = () => {
    if(this.props.fromManageFriends){
      this.props.onProfileClick();
    }
    else{
      if(!this.props.added){
        this.props.pass._addUserSelected({"userid": this.props.userid, "name": this.props.username});
      }
      else{
        this.props.pass._removeUserSelected({"userid": this.props.userid, "name": this.props.username});
      }
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => this._handlePress() }  style={{flexDirection: "row", alignItems: "center", height: 60, width: screenWidth, backgroundColor: (this.props.bc === undefined)?"white":this.props.bc}}>
        {(this.props.isCreatingGroup)?<>
        <View style={{height: 60, width: 15}}></View>
        <View style={{height: 60, width: 30, justifyContent: "center", alignItems: "center"}}>
          <View style={{height: 16, width: 16, backgroundColor: (this.props.added)?"#6970ff":"white", borderRadius: 14, borderWidth: (this.props.added)?0:1, borderColor: "gray", justifyContent: "center", alignItems: "center"}}>
            {(this.props.added)?<Icon color={"white"} size={10} name={"check"} />:<View></View>}
          </View>
        </View></>
        :
        <View></View>}
          <View style={{height: 50, width: 'auto', justifyContent: "center", alignItems: "center"}}>
            <View style={{height: 50, width: 'auto', marginLeft: 10, marginRight: 10, justifyContent: "center", alignItems: "center", backgroundColor: "white"}}>
              <FastImage
              style={{height: 45, width: 45, borderRadius: 25, backgroundColor: "white"}}
              source={{uri: imageURL + this.props.avatar, priority: FastImage.priority.normal}}
              onError={() => {this.setState({ image: global.main.noavatar})}} ></FastImage>
            </View>
          </View>
        <View style={{height: '100%', maxWidth: '50%', justifyContent: "center"}}>
          <TitleText numberOfLines={1} size={16} text={this.props.username} />
          {(this.props.isFriend)?
          <View style={{padding: 2, paddingLeft: 5, paddingRight: 5, backgroundColor: "#3CB371", borderRadius: 5, width: 51}}>
            <TitleText size={12} color={"white"} text={"Friends"} />
          </View>
          :
          (this.props.isRequested)?
          <View style={{padding: 2, paddingLeft: 5, paddingRight: 5, backgroundColor: "#4080ff", borderRadius: 5, width: 69}}>
            <TitleText size={12} color={"white"} text={"Requested"} />
          </View>
          :
          (this.props.isBlocked)?
          <View style={{padding: 2, paddingLeft: 5, paddingRight: 5, backgroundColor: "tomato", borderRadius: 5, width: 54}}>
            <TitleText size={12} color={"white"} text={"Blocked"} />
          </View>
          :
          <View></View>
          }
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
