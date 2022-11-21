import React, {Component} from 'react';
import { Dimensions, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IonIcons from 'react-native-vector-icons/Foundation';
import FastImage from 'react-native-fast-image'
import * as RNLocalize from "react-native-localize";
import moment from 'moment-timezone';
import Dialog from "react-native-dialog";

import { apiCall, imageURL } from '../utilities/Connector';
import GLOBAL from '../global';
import GLOBALassets from '../utilities/global';

import TitleText from '../elements/TitleText';

let screenWidth = Dimensions.get('window').width;

class Comment extends Component {

  state = {
    liked: this.props.liked,
    likes: this.props.likes,
    height: 0,
    image: {uri: imageURL + this.props.profile_picture, priority: FastImage.priority.normal},
    openedReportMenu: false,
    openedDeleteMenu: false,
    thanksForReport: false
  }

  shouldComponentUpdate(nextProps){
    if(nextProps.liked != this.state.liked || nextProps.likes != this.state.likes){
      this.setState({
        liked: nextProps.liked,
        likes: nextProps.likes
      });
    }
    return true;
  }

  _handleLike = async () => {
    var likes = (this.state.liked)?parseInt(this.state.likes)-1:parseInt(this.state.likes)+1;
    this.setState({
      liked: !this.state.liked,
      likes
    });
      var formdata = new FormData();
      formdata.append("commentid", this.props.commentid);
      const resp = await apiCall("/p/lc",formdata);
  }

  _reportComment = async () => {
      var formdata = new FormData();
      formdata.append("commentid", this.props.commentid);
      const resp = await apiCall("/p/rc",formdata);
      setTimeout(() => {
        this.setState({
          thanksForReport: true
        })
      }, 500)

  }

  _deleteComment = async () => {
      var formdata = new FormData();
      formdata.append("commentid", this.props.commentid);
      const resp = await apiCall("/p/dc",formdata);
      this.props.refreshCommentsFunc();
  }

  _onClick = () => {
    if(!this.props.fullPost){
      this.props.func();
    }
  }

  _onLongPress = () => {
    if(!this.props.fullPost){
      return;
    }
    if(this.props.isMine){
      this.setState({
        openedDeleteMenu: true
      });
    }
    else{
      this.setState({
        openedReportMenu: true
      });
    }
  }

  openUserProfile = () => {
    if(this.props.userid != "-1"){
      Actions.previewprofile({allowReport: (this.props.userid == "me")?false:true, fromFriendsConvo: true, "userid": this.props.userid})
    }
  }

  renderTime = (time) => {
    var date = moment(time).local();
    var display = "";
    var isToday = moment(time).isSame(moment(), 'day');
    if(isToday){
      display = date.format("h:mm A");
    }
    else{
      display = date.format("h:mm A MMM D YYYY");
    }
    return(display);
  }

  render() {
    console.disableYellowBox = true;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this._onClick} onLongPress={this._onLongPress}>
        <View onLayout={(event) => { this.setState({height: event.nativeEvent.layout.height}); }} style={{paddingTop: 8, paddingRight: 10, paddingLeft: 10, height: 'auto', width: '100%',flexDirection: "row", alignItems: "center"}}>
        <View style={{padding: 5, borderTopRightRadius: 15, borderBottomRightRadius: 15, borderBottomLeftRadius: 15, height: 'auto', width: '100%', backgroundColor: "#d4d4d4",shadowColor: '#000',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,}}>
          <View style={{height: 30, flexDirection: "row"}}>
            <TouchableOpacity style={{marginLeft: 5, flexDirection: "row", alignItems: "center"}} activeOpacity={(this.props.userid == "-1")?1:0.7} onPress={() => this.openUserProfile()}>
              <FastImage
                source={(this.state.fallback)?globalassets.main.groupicon:{uri: imageURL + this.props.profile_picture, priority: FastImage.priority.normal}}
                style={{height: 30, width: 30, borderRadius: 15, backgroundColor: "white", marginRight: 5}}
                onError={() => {this.setState({ fallback: true})}}
              ></FastImage>
              <View style={{maxWidth: '80%'}}>
              <TitleText numberOfLines={1} size={14} type={"med"} text={this.props.username} />
              <TitleText numberOfLines={1} extraStyle={{marginLeft: 2}} size={10} color={"black"} text={this.renderTime(this.props.time_submitted)} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleLike()} style={{position: "absolute", right: 0, marginRight: 5, alignItems: "center", justifyContent: "center"}}>
              {(this.state.liked)?<IonIcons name={"heart"} size={16} color={"red"} />:<Icon name={"heart"} size={14} color={"red"} />}
              <TitleText size={12} color={"#3e3e3e"} text={this.state.likes} />
            </TouchableOpacity>
          </View>
          <View style={{padding: 5}}>
              <TitleText numberOfLines={(this.props.fullPost)?30:4}  allowLinks={true} size={16} color={"#2e2e2e"} text={this.props.comment} />
          </View>
        </View>
        {(this.props.loading)?<View style={{height: this.state.height, width: screenWidth, backgroundColor: "rgba(251, 251, 248,0.6)", position: "absolute", justifyContent: "center", alignItems: "center", paddingTop: 10}}>
          <ActivityIndicator size="small" color="purple" />
        </View>:<View></View>}
      </View>
      <View>
        <Dialog.Container visible={this.state.openedReportMenu}>
          <Dialog.Title>Report Comment</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to report this comment?
          </Dialog.Description>
          <Dialog.Button onPress={() => this.setState({openedReportMenu: false})} label="Close" />
          <Dialog.Button onPress={() => {this.setState({openedReportMenu: false}); this._reportComment()}} label="Report" />
        </Dialog.Container>
      </View>
      <View>
        <Dialog.Container visible={this.state.openedDeleteMenu}>
          <Dialog.Title>Delete Comment</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this comment?
          </Dialog.Description>
          <Dialog.Button onPress={() => this.setState({openedDeleteMenu: false})} label="Close" />
          <Dialog.Button onPress={() => {this.setState({openedDeleteMenu: false}); this._deleteComment()}} label="Delete" />
        </Dialog.Container>
      </View>
      <View>
        <Dialog.Container visible={this.state.thanksForReport}>
          <Dialog.Title>Report Submitted</Dialog.Title>
          <Dialog.Description>
            Thanks for the report, we'll take a look into it.
          </Dialog.Description>
          <Dialog.Button onPress={() => this.setState({thanksForReport: false})} label="Close" />
        </Dialog.Container>
      </View>
    </TouchableOpacity>
   );
 }
}

export default Comment;
