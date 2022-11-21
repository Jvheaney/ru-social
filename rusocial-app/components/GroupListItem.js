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

import globalassets from '../utilities/global';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class GroupListItem extends Component {

  state = {

  }

  componentDidMount() {
  }

  render() {
    console.disableYellowBox = true;

    return (
          <TouchableOpacity style={{shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2}} activeOpacity={0.8} onPress={() => {Actions.groupTimeline({image: this.props.avatar, groupid: this.props.groupid, groupName: this.props.name, isGroupAdmin: this.props.isGroupAdmin, isPrivate: this.props.isPrivate, isMember: true})}} >
            <View style={{backgroundColor: "white", height: 200, width: screenWidth*0.4, marginLeft: (screenWidth*0.2)/3, marginTop: 10, marginBottom: 10, borderRadius: 20, borderWidth: 2, borderColor:"#6970ff", alignItems: "center", justifyContent: "center"}}>
                  {(this.props.avatar.length > 4 && this.props.avatar.substring(0,3) != "def")?
                    <FastImage source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.avatar, priority: FastImage.priority.normal}} style={{height: 80, width: 80, borderRadius: 40, borderColor:"#6970ff", borderWidth: 2}}></FastImage>
                  :
                    <Image source={globalassets.main[this.props.avatar]} style={{height: 80, width: 80, borderRadius: 40, borderColor:"#6970ff", borderWidth: 2}} />
                  }
                <View style={{marginTop: 5, height: 'auto', maxHeight: 75, justifyContent: "center"}}>
                  <Text numberOfLines={2} style={{fontSize: 16, paddingLeft: 5, paddingRight: 5, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>{this.props.name}</Text>
                </View>
                {(this.props.isGroupAdmin)?
                <View style={{marginTop: 5, backgroundColor: "#FFD700", width: 50, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontSize: 12, color: "black", fontFamily: "Raleway-Regular"}}>Admin</Text>
                </View>
                :
                <View style={{marginTop: 5, backgroundColor: "#3aa14b", width: 60, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontSize: 12, color: "white", fontFamily: "Raleway-Regular"}}>Member</Text>
                </View>
                }
                {(this.props.isPrivate)?
                <View style={{marginTop: 5, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                  <LineIcon name="lock" size={12} color="black" />
                </View>
                :
                <View style={{marginTop: 5, height: 15, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                  <LineIcon name="globe" size={12} color="black" />
                </View>}
            </View>
          </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default GroupListItem;
