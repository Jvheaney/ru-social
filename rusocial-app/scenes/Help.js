import React, {Component} from 'react';
import { TextInput, TouchableOpacity, Dimensions, ScrollView, View, Text } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Dialog from "react-native-dialog";

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';

import Post from '../components/Post';

import { apiCall } from '../utilities/Connector';
import global from '../utilities/global';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

let tappedReport = false;

class Help extends Component {

  state = {
    reportUserDialog: false,
    reportUserMessage: ''
  }

  _reportUserInCircleDialog = () => {
      this.setState({
        reportUserDialog: true
      })
  }
  _reportUserInCircle = async () => {
    if(!tappedReport){
      tappedReport = true;
      this.setState({
        reportUserDialog: false
      });
      if(this.state.reportUserMessage.length>0){
        var formdata = new FormData();
        formdata.append("message", this.cleanSmartPunctuation(this.state.reportUserMessage));
        formdata.append("reportedid", this.props.anonid);
        formdata.append("type",3);
        const resp = await apiCall("/r/s",formdata);
        tappedReport = false;
        if(resp.status == "fail"){
          if(resp.reason == "Incorrect data"){
            alert("There was a problem making your report.");
          }
          else if(resp.reason == "Token failed"){
            Actions.replace("login");
          }
          else{
            alert("There was a problem with the server. Please try again later.");
          }
        }
        else if(resp.status == "success"){
          alert("Your report has been submitted");
        }
      }
    }
  }
  _cancelReport = () => {
    this.setState({
      reportUserDialog: false
    })
  }

  _handleReportText = (message) => {
    this.setState({
      reportUserMessage: message
    })
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  render() {

    return (
      //
      <Container>
        <View style={{height: 40, width: '100%', backgroundColor: "white", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.pop()} style={{paddingLeft: 10}}>
            <Icon size={20} name={"chevron-left"} color={"#000"} />
          </TouchableOpacity>
          <TitleText extraStyle={{left: -10}} size={24} type={"bold"} text={"Help/Information"} />
          <TouchableOpacity>
          </TouchableOpacity>
        </View>
        {(this.props.message == "anonymous")?
          <View style={{paddingTop: 5}}>
            <View style={{justifyContent: "center", alignItems: "center", paddingBottom: 5}}>
              <TitleText size={18} type={"med"} text={"Anonymous Users/Groups"} />
            </View>
            <View style={{padding: 10}}>
              <TitleText color={"#5c5c5c"} size={16} text={"This post was made in an anonymous group. That means that the user's account information is hidden on all posts or comments made in this group."} />
            </View>
            <View style={{padding: 10}}>
              <TitleText color={"#5c5c5c"} size={16} text={"You can still report this account if you believe that what they posted goes against our guidelines, or they are in need of help."} />
            </View>
            <View style={{width: screenWidth, height: 120, justifyContent: "center", alignItems: "center"}}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this._reportUserInCircleDialog()} style={{height: 40, width: screenWidth*0.4, borderRadius: 10, backgroundColor: "tomato", justifyContent: "center", alignItems: "center"}}>
                <TitleText size={20} type={"med"} color={"white"} text={"Report User"} />
              </TouchableOpacity>
            </View>
          </View>
        :
          <TitleText size={18} text={"Nothing to see here."} />
        }
        <View>
          <Dialog.Container visible={this.state.reportUserDialog}>
          <Dialog.Title>Report {this.props.username}</Dialog.Title>
          <Dialog.Description>
            Why are you reporting this user?
          </Dialog.Description>
          <Dialog.Input
          placeholder="Reason"
          placeholderTextColor="#aaaaaa"
          style={{color: "black"}}
          multiline={true}
          onChangeText={(message) => this._handleReportText(message)}
          >
          </Dialog.Input>
          <Dialog.Button onPress={() => this._cancelReport()} label="Cancel" />
          <Dialog.Button onPress={() => this._reportUserInCircle()} label="Report" />
          </Dialog.Container>
        </View>
      </Container>
   );
 }
}

export default Help;
