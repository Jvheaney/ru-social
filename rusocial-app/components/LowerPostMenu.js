import React, {Component} from 'react';
import { Clipboard, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, View, Text } from 'react-native';

import { Actions } from 'react-native-router-flux';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Dialog from "react-native-dialog";

import TitleText from '../elements/TitleText';

import { apiCall } from '../utilities/Connector'

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

let tappedReport = false;

class LowerPostMenu extends Component {

  state = {
    reportUserDialog: false,
    reportUserMessage: ""
  }

  _reportUserInCircleDialog = () => {
    this.setState({
      reportUserDialog: true
    })
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _flagPost = async () => {
    this.setState({
      flagPostDialog: true
    });
    if(!tappedReport){
      if(this.props.postid == undefined){
        return;
      }
      tappedReport = true;
        var formdata = new FormData();
        formdata.append("postid", this.props.postid);
        const resp = await apiCall("/p/rp",formdata);
        tappedReport = false;
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

  render() {

    return (
      <View style={{paddingTop: 20}}>
      <View style={{flexDirection: "row", height: 60, width: '100%', paddingLeft: '5%', paddingRight: '5%', justifyContent: "space-between", alignItems: "center"}}>
        {(false)?
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.pass._openShareSheet({"postid":this.props.postid})} style={{width: '33%', justifyContent: "center", alignItems: "center"}}>
          <View style={{marginBottom: 5, backgroundColor: "#4080ff", justifyContent: "center", alignItems: "center", height: 60, width: 60, borderRadius: 30}}>
            <LineIcon size={22} name={"share"} color={"white"} />
          </View>
          <TitleText size={14} text={"Share Post"} />
        </TouchableOpacity>:<View></View>}
        {(this.props.isFullPost == undefined || !this.props.isFullPost)?
        <TouchableOpacity activeOpacity={0.5} onPress={() => {this.props.pass.RBSheet.close(); Actions.post({"id":this.props.postid, "isMember": this.props.isMember})}} style={{alignItems: "center", width: '50%', justifyContent: "center"}}>
          <View style={{marginBottom: 5, borderWidth: 2, borderColor: "#6970ff", justifyContent: "center", alignItems: "center", height: 60, width: 60, borderRadius: 30}}>
            <LineIcon size={22} name={"size-fullscreen"} color={"#6970ff"} />
          </View>
          <TitleText size={14} text={"See Full Post"} />
        </TouchableOpacity>:<View></View>}
        {(this.props.isMine)?
        <TouchableOpacity activeOpacity={0.5} onPress={() => { this.props.pass.RBSheet.close(); Actions.editPost({"postid":this.props.postid, "media": this.props.media, "text": this.props.text, "postType": this.props.postType, "allowSharing": this.props.allowSharing, "allowComments": this.props.allowComments, "postRef": this.props.postRef, "pass": this.props.pass})}} style={{alignItems: "center", width: (this.props.isFullPost == undefined || !this.props.isFullPost)?'50%':'100%', justifyContent: "center"}}>
          <View style={{marginBottom: 5, backgroundColor: "#aaaaaa", justifyContent: "center", alignItems: "center", height: 60, width: 60, borderRadius: 30}}>
            <LineIcon size={22} name={"pencil"} color={"white"} />
          </View>
          <TitleText size={14} text={"Manage Post"} />
        </TouchableOpacity>
        :
        <TouchableOpacity activeOpacity={0.5} onPress={() => this._flagPost()} style={{alignItems: "center", width: (this.props.isFullPost == undefined || !this.props.isFullPost)?'50%':'100%', justifyContent: "center"}}>
          <View style={{marginBottom: 5, backgroundColor: "#aaaaaa", justifyContent: "center", alignItems: "center", height: 60, width: 60, borderRadius: 30,}}>
            <LineIcon size={22} name={"flag"} color={"white"} />
          </View>
          <TitleText size={14} text={"Report Post"} />
        </TouchableOpacity>
        }
      </View>
      <View>
        <Dialog.Container visible={this.state.flagPostDialog}>
        <Dialog.Title>Post Reported</Dialog.Title>
        <Dialog.Description>
          Thanks for reporting this post, we'll take a look into it.
        </Dialog.Description>
        <Dialog.Button onPress={() => {this.setState({flagPostDialog: false}); this.props.pass.RBSheet.close();}} label="OK" />
        </Dialog.Container>
      </View>
    </View>
   );
 }
}

export default LowerPostMenu;
