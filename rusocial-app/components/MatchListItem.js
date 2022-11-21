import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import * as RNLocalize from "react-native-localize";
import moment from 'moment-timezone';
//import Dialog from "react-native-dialog";

import globalassets from '../utilities/global';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome'

import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

function timeSentParse(timeStamp){

  if(Platform.OS == "android"){
    return;
  }

  var tz = RNLocalize.getTimeZone();

  try {
    var working_date = moment(timeStamp).tz(tz);
    var now = moment().tz(tz).unix() , secondsPast = (now - moment(timeStamp).tz(tz).unix() );
    if(secondsPast <= 86400){
      //Less than a day
      //Display HH:mm

      var AMPM = "AM";
      var hours = working_date.hour();
      if(hours == 0){
        hours = 12;
      }
      else if(hours > 12){
        AMPM = "PM";
        hours = hours - 12;
      }
      else if(hours == 12){
        AMPM = "PM";
      }
      var minutes = working_date.minute();
      if(minutes < 10){
        minutes = "0" + minutes;
      }
      return(hours + ":" + minutes + " " + AMPM);
    }
    else if(secondsPast <= 604800){
      //Less than a week
      //Display ddd
      var dayNum = working_date.day();
      var dayString = "Sun";
      if(dayNum == 1){
        dayString = "Mon";
      }
      else if(dayNum == 2){
        dayString = "Tues";
      }
      else if(dayNum == 3){
        dayString = "Wed";
      }
      else if(dayNum == 4){
        dayString = "Thurs";
      }
      else if(dayNum == 5){
        dayString = "Fri";
      }
      else if(dayNum == 6){
        dayString = "Sat";
      }
      return dayString;
    }
    else if(secondsPast <= 31556952){
      //Less than a year
      //display MMM dd
      var monthNum = working_date.month();
      var dayNum = working_date.date();
      var monthString = "Jan";
      if(monthNum == 1){
        monthString = "Feb";
      }
      else if(monthNum == 2){
        monthString = "Mar";
      }
      else if(monthNum == 3){
        monthString = "Apr"
      }
      else if(monthNum == 4){
        monthString = "May";
      }
      else if(monthNum == 5){
        monthString = "Jun";
      }
      else if(monthNum == 6){
        monthString = "Jul";
      }
      else if(monthNum == 7){
        monthString = "Aug";
      }
      else if(monthNum == 8){
        monthString = "Sep";
      }
      else if(monthNum == 9){
        monthString = "Oct";
      }
      else if(monthNum == 10){
        monthString = "Nov";
      }
      else if(monthNum == 11){
        monthString = "Dec";
      }

      return(monthString + " " + dayNum);

    }
    else{
      //Greater than a year
      //display dd/MM/YY
      var monthNum = working_date.month();
      monthNum = monthNum + 1;
      var dayNum = working_date.date();
      var yearNum = working_date.year();
      return(dayNum + "/" + monthNum + "/" + yearNum);
    }
  }
  catch(e){
    return;
  }
}

class MatchListItem extends Component {

  convertToReadableTime = (timeStamp) => {
    // get device timezone eg. -> "Asia/Shanghai"
    const deviceTimeZone = RNLocalize.getTimeZone();

    // Make moment of right now, using the device timezone
    const today = moment().tz(deviceTimeZone);

    // Get the UTC offset in hours
    const currentTimeZoneOffsetInHours = today.utcOffset() / 60;

    const convertedToLocalTime = this.formatTimeByOffset(
      timeStamp,
      currentTimeZoneOffsetInHours,
    );

    // Set the state or whatever
    return timeSentParse(convertedToLocalTime);
  }


  formatTimeByOffset = (dateString, offset) => {
  // Params:
  // How the backend sends me a timestamp
  // dateString: on the form yyyy-mm-dd hh:mm:ss
  // offset: the amount of hours to add.

  // If we pass anything falsy return empty string
  if (!dateString) return ''
  if (dateString.length === 0) return ''

  // Step 1: Parse the backend date string

  // Get Parameters needed to create a new date object
  const year = dateString.slice(0, 4)
  const month = dateString.slice(5, 7)
  const day = dateString.slice(8, 10)
  const hour = dateString.slice(11, 13)
  const minute = dateString.slice(14, 16)
  const second = dateString.slice(17, 19)

  // Step: 2 Make a JS date object with the data
  const dateObject = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)

  // Step 3: Get the current hours from the object
  const currentHours = dateObject.getHours()

  // Step 4: Add the offset to the date object
  dateObject.setHours(currentHours + offset)

  // Step 5: stringify the date object, replace the T with a space and slice off the seconds.
  const newDateString = dateObject
    .toISOString()
    .replace('T', ' ')
    .slice(0, 16)

  // Step 6: Return the new formatted date string with the added offset
  return `${newDateString}`
}

  state = {

  }

  renderMessage = () => {
    if(this.props.message.length > 47){
      return this.props.message.substring(0,47) + "...";
    }
    else{
      return this.props.message
    }
  }

  _route = () => {
    if(this.props.type == 2){
      Actions.matchConvo({fromGroupTimeline: false, matchid: this.props.matchid, avatar: (this.props.avatar && this.props.avatar.length == 4 && this.props.avatar.substring(0,3) == "def")?this.props.avatar:'https://rumine.ca/_i/s/i.php?i=' + this.props.avatar, username: this.props.name, userid: this.props.matchid, _type:2});
    }
    else{
      Actions.matchConvo({matchid: this.props.matchid, avatar: 'https://rumine.ca/_i/s/i.php?i=' + this.props.avatar, username: this.props.name, userid: this.props.userid, _type:this.props.type})
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
          <TouchableOpacity activeOpacity={0.8} onPress={() => this._route()} >
            <View style={{minHeight: screenWidth*0.20, height: 'auto', width: screenWidth, backgroundColor: "white", flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{flexDirection: "row"}}>
                <View style={{minHeight: screenWidth*0.20, height: 'auto', width: screenWidth*0.20, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                  <FastImage source={(this.props.avatar && this.props.avatar.length == 4 && this.props.avatar.substring(0,3) == "def")?globalassets.main[this.props.avatar]:{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.avatar, priority: FastImage.priority.normal}} style={{height: screenWidth*0.15, width: screenWidth*0.15, borderRadius: screenWidth*0.1, borderColor:(this.props.type==2)?"#6970ff":(this.props.type==0)?"#ff5b99":"#5bb8ff", borderWidth: 2}}></FastImage>
                </View>
                <View style={{minHeight: screenWidth*0.20, height: 'auto', maxHeight: screenWidth*0.3, width: screenWidth*0.65, backgroundColor: "white", paddingBottom: 10}}>
                  <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection: "row", alignItems: "center", paddingTop: 10}}>
                      <Icon name={(this.props.type==2)?"comments":(this.props.type==0)?"heart":"users"} size={15} color={(this.props.type==2)?"#6970ff":(this.props.type==0)?"#ff5b99":"#5bb8ff"} family={"FontAwesome"} />
                      <Text numberOfLines={1} style={{fontSize: 18, paddingLeft: 5, textAlign: "left", color: "black", fontFamily: "Raleway-Medium"}}>{this.props.name}</Text>
                      {(!this.props.read && !this.props.sent)?<View style={{left: 5, height: 8, width: 8, borderRadius: 5, backgroundColor: "#85caff"}}></View>:<View></View>}
                    </View>
                  </View>
                  <View style ={{flexDirection:"row", flexShrink: 1, alignItems: "center"}} >
                    {(this.props.sent)?<Ionicons style = {{marginRight: 5}} name="ios-return-left" size={20} color={(this.props.type==2)?"#6970ff":(this.props.type==0)?"#ff5b99":"#5bb8ff"} />:<View></View>}
                    <View style={{flexDirection: "row"}}>
                    {(this.props.group_fname != undefined && this.props.group_fname != null && this.props.group_fname != "null" && this.props.type==2)?
                      <Text style={{paddingLeft: 5, fontSize: 14, textAlign: "left", color: "black", fontFamily: (!this.props.read && !this.props.sent)?"Raleway-Bold":"Raleway-Light"}}>{this.props.group_fname}: {this.renderMessage()} {(this.props.time_sent)?<Text style={{fontSize: 9, textAlign: "left", color: "gray", fontFamily: "Raleway-Medium"}}>{timeSentParse(this.props.time_sent)}</Text>:<View></View>}</Text>
                    :
                      <Text style={{paddingLeft: 5, fontSize: 14, textAlign: "left", color: "black", fontFamily: (!this.props.read && !this.props.sent)?"Raleway-Bold":"Raleway-Light"}}>{this.renderMessage()} {(this.props.time_sent)?<Text style={{fontSize: 9, textAlign: "left", color: "gray", fontFamily: "Raleway-Medium"}}>{timeSentParse(this.props.time_sent)}</Text>:<View></View>}</Text>
                    }
                    </View>
                  </View>
                  {(this.props.read && this.props.type == 1 && this.props.sent)?<View style={{flexDirection: "row"}}><Icon style={{marginRight: 2}} name="check" size={10} color={"gray"} /><Text style={{fontSize: 10, textAlign: "left", color: "gray", fontFamily: "Raleway-Medium"}}>Read</Text></View>:<View></View>}
                </View>
              </View>
              <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <View style={{marginRight: 10, justifyContent: "center", alignItems: "center"}}><LineIcon name="arrow-right" size={12} color="black" /></View>
              </View>
            </View>
          </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default MatchListItem;
