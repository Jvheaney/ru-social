import React, {Component} from 'react';
import { Platform, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Foundation';
import FastImage from 'react-native-fast-image'

import * as RNLocalize from "react-native-localize";
import moment from 'moment-timezone';

import Comment from '../components/Comment';

import GLOBAL from '../global.js'
import GLOBALassets from '../utilities/global.js'

import { apiCall, imageURL } from '../utilities/Connector';

import TitleText from '../elements/TitleText';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

let tappedCreateComment = false;
let likeHasChanged = false;
let imageUpdate = false;

let seekToTime = 0;
var previousPostId = "";

class Post extends Component {

  state = {
    screen: "home",
    liked: this.props.liked,
    likes: this.props.likes,
    commentsNumber: this.props.comments,
    shares: this.props.shares,
    commentsArray: (this.props.commentsArray === undefined)?[]:this.props.commentsArray,
    commentTyped: "",
    bookmarked: this.props.bookmarked,
    heightScaled: 0,
    muted: true,
    paused: false,
    seekToTime: 0,
    image: {uri: imageURL + this.props.profile_picture, priority: FastImage.priority.normal},
    text: this.props.text,
    allowComments: this.props.allowComments,
    allowSharing: this.props.allowSharing
  }

  shouldComponentUpdate(nextProps, nextState){

    if(nextProps.likes != this.state.likes || nextProps.liked != this.state.liked || nextProps.comments != this.state.commentsNumber || nextProps.shares != this.state.shares){
      this.setState({
        liked: nextProps.liked,
        likes: nextProps.likes,
        commentsNumber: nextProps.comments,
        shares: nextProps.shares
      })

      return true;
    }

    if(nextState.text != this.state.text || nextState.allowComments != this.state.allowComments || nextState.allowSharing != this.state.allowSharing){
      return true;
    }

    if(nextProps.text != this.state.text || nextProps.allowComments != this.state.allowComments || nextProps.allowSharing != this.state.allowSharing){
      this.setState({
        text: nextProps.text,
        allowComments: nextProps.allowComments,
        allowSharing: nextProps.allowSharing
      })
      return true;
    }

    /*if(this.props.postid != previousPostId){
      console.log("fourth");
      previousPostId = this.props.postid;
      return true;
    }*/

    if(imageUpdate){
      imageUpdate = false;
      return true;
    }
    if(this.props.fullPost){
      return true;
    }
    //if liked > previous liked
    if(likeHasChanged){
      likeHasChanged = false;
      return true;
    }
    return false;
  }

  _toggleLike = async () => {
    if(this.state.liked){
      this.setState({
        liked: false,
        likes: this.state.likes - 1
      });
    }
    else{
      this.setState({
        liked: true,
        likes: this.state.likes + 1
      });
    }
    likeHasChanged = true;
    var formdata = new FormData();
    formdata.append("postid", this.props.postid);
    const resp = await apiCall("/p/lp",formdata);
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _addComment = async () => {
    var arr = this.state.commentsArray;
    var commentInstance = this.state.commentTyped;
    arr.push({"first_name": global.main.first_name, "last_name": global.main.last_name, "userid": global.main.myuserid, "text": commentInstance, "profile_picture": "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/03/18/15/billgates.jpg", "liked":false,"numberOfCommentLikes":"0"});
    this.setState({
      commentsArray: arr,
      commentTyped: ""
    });
    //this.refs['postscrollview'].scrollToEnd({animated:true});
    if(commentInstance.length > 0 && !tappedCreateComment){
      tappedCreateComment = true;
      var formdata = new FormData();
      formdata.append("postid", this.props.postid);
      formdata.append("text", this.cleanSmartPunctuation(commentInstance));
      const resp = await apiCall("/p/c", formdata);
      tappedCreateComment = false;
      if(resp.status == "fail"){
        if(resp.reason == "Incorrect data"){
          alert("There was a problem posting your comment.");
        }
        else if(resp.reason == "Token failed"){
          Actions.replace("login");
        }
        else{
          alert("There was a problem with the server. Please try again later.");
        }
      }
      else if(resp.status == "success"){
        var data = JSON.parse(resp.data);
        arr = this.state.commentsArray;
        var obj = arr[arr.length-1];
        obj.loading = false;
        obj.commentid = data;
        arr[arr.length - 1] = obj;
        this.setState({
          commentsArray: arr
        });
      }
    }
  }

  _openImage = (num) => {
    alert(num);
  }

  _openComments = () => {
    if(!this.props.fullPost){
      Actions.post({"id":this.props.postid, "groupName": this.props.circleName, "isMember": this.props.isMember})
    }
  }

  _handleRoute = (route) => {
    this.setState({
      screen: route
    })
  }

  _openShare = () => {
    alert("open share");
  }

  _bookmarkPost = () => {
    this.setState({
      bookmarked: !this.state.bookmarked,
    });
  }

  _openFullPost = () => {
    if(!this.props.fullPost){
      Actions.post({"id":this.props.postid, "groupName": this.props.circleName, "isMember": this.props.isMember})
    }
  }

  _handleCommentType = (val) => {
    this.setState({
      commentTyped: val
    })
  }

  openUserProfile = () => {
    if(this.props.userid != "-1"){
      Actions.previewprofile({allowReport: true, fromFriendsConvo: true, "userid": this.props.userid})
    }
    else{
      Actions.help({"message":"anonymous", "anonid": this.props.username});
    }
  }

  postTopper = () => {
    return (
      <View style={{padding: 5, paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
        <TouchableOpacity activeOpacity={(this.props.userid == "-1")?1:0.7} onPress={() => this.openUserProfile()} style={{paddingLeft: 5, flexDirection: "row", alignItems: "center"}}>
          <FastImage
            source={this.state.image}
            onLoad={() => {imageUpdate = true;}}
            onError={() => {imageUpdate = true; this.setState({ image: GLOBALassets.main.noavatar})}}
            style={{marginRight: 5, height: 30, width: 30, borderRadius: 22, backgroundColor: "white"}} ></FastImage>
          <View>
          <TitleText size={16} type={"bold"} text={this.props.username} />
          </View>
        </TouchableOpacity>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          {(this.props.inCircle)?<View></View>
            :
            <TouchableOpacity style={{paddingLeft: 5, flexDirection: "row", alignItems: "center"}} activeOpacity={1} onPress={() => /*Actions.groupTimeline({"groupid":this.props.groupid, "groupName":this.props.circleName})*/{}}>
                <View style={{paddingRight: 5}}><FAIcon size={14} name={"comments"} color={"black"} /></View>
                <TitleText size={14} text={this.props.circleName} />
            </TouchableOpacity>}
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.pass._openBottomMenu({"menuType":"menu", "postid":this.props.postid, "isMine": this.props.isMine, "media": this.props.media, "text":this.state.text, "type": this.props.type, "allowComments": this.state.allowComments, "allowSharing": this.state.allowSharing, "postRef": this})} style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <View style={{paddingLeft: 10, paddingRight: 10, justifyContent: "center", alignItems: "center"}}>
              <Icon size={22} name={"ellipsis-v"} color={"black"} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
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

  postCard = () => {
    return (
      <TouchableOpacity activeOpacity={(this.props.fullPost)?1:0.7} onPress={() => this._openFullPost()} style={{
        width: screenWidth,
        marginBottom: 0,
        backgroundColor: "white",
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
        borderRadius: 20}}>

        <View style={{padding: 5, paddingTop: 10, paddingBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={(this.props.userid == "-1")?1:0.7} onPress={() => this.openUserProfile()} style={{paddingLeft: 5, flexDirection: "row", alignItems: "center"}}>
            <FastImage
              source={this.state.image}
              onLoad={() => {imageUpdate = true;}}
              onError={() => {imageUpdate = true; this.setState({ image: GLOBALassets.main.noavatar})}}
              style={{marginRight: 5, height: 40, width: 40, borderRadius: 20, backgroundColor: "white"}} ></FastImage>
            <View style={{maxWidth: '80%'}}>
            <TitleText numberOfLines={1} size={16} type={"bold"} text={this.props.username} />
            <TitleText numberOfLines={1} size={10} text={this.renderTime(this.props.time_submitted)} />
            </View>
          </TouchableOpacity>
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.pass._openBottomMenu({"menuType":"menu", "postid":this.props.postid, "isMine": this.props.isMine, "media": this.props.media, "text":this.state.text, "type": this.props.type, "allowComments": this.state.allowComments, "allowSharing": this.state.allowSharing, "postRef": this})} style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
              <View style={{paddingLeft: 10, paddingRight: 10, justifyContent: "center", alignItems: "center"}}>
                <Icon size={22} name={"ellipsis-v"} color={"black"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {(this.state.text.length>0)?
        <View style={{paddingLeft: 15, paddingRight: 15, paddingBottom: 10, width: '100%', height: 'auto'}}>
          <TitleText numberOfLines={(this.props.fullPost)?50:8} allowLinks={true} size={16} text={this.state.text} />
        </View>:<View></View>}

        {(this.props.type != 0)?
          <View style={{height: 'auto', width: '100%', alignItems: "center", marginBottom: 5}}>
          {(this.props.type == 1 && this.props.media.length == 0)?
            <View></View>
          :
          (this.props.type == 1 && this.props.media.length == 1)?
          <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.media[0]})} style={{borderRadius: 10, height: 'auto', width: screenWidth-30}}>
            <FastImage
              source={{uri: imageURL + this.props.media[0], priority: FastImage.priority.normal}}
              style={{borderRadius: 10, height: 300, width: '100%'}}
              resizeMode={"cover"}
             ></FastImage>
          </TouchableOpacity>
          :(this.props.type == 1 && this.props.media.length == 2)?
          <View style={{height: 300, width: '100%', flexDirection: "row", justifyContent: "center"}}>
            <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.media[0]})} style={{paddingRight: 1.5, height: '100%', width: screenWidth/2-15}}>
              <FastImage
                source={{uri: imageURL + this.props.media[0], priority: FastImage.priority.normal}}
                style={{borderTopLeftRadius: 10, borderBottomLeftRadius: 10, height: '100%', width: '100%'}}
                resizeMode={"cover"}
                ></FastImage>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.media[1]})} style={{paddingLeft: 1.5, height: '100%', width: screenWidth/2-15}}>
              <FastImage
                source={{uri: imageURL + this.props.media[1], priority: FastImage.priority.normal}}
                style={{borderTopRightRadius: 10, borderBottomRightRadius: 10, height: '100%', width: '100%'}}
                resizeMode={"cover"}
                ></FastImage>
            </TouchableOpacity>
          </View>
          :
          <View style={{height: 'auto', width: '100%', flexDirection: "row", justifyContent: "center"}}>
            <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.media[0]})} style={{paddingRight: 1.5, height: 300, width: screenWidth*0.6-15}}>
              <FastImage
                source={{uri: imageURL + this.props.media[0], priority: FastImage.priority.normal}}
                style={{borderTopLeftRadius: 10, borderBottomLeftRadius: 10, height: '100%', width: '100%'}}
                resizeMode={"cover"}
                ></FastImage>
            </TouchableOpacity>
            <View style={{paddingLeft: 1.5, height: 150, width: screenWidth*0.4-15}}>
              <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.media[1]})} style={{paddingBottom: 1.5, height: '100%', width: '100%'}}>
                <FastImage
                  source={{uri: imageURL + this.props.media[1], priority: FastImage.priority.normal}}
                  style={{borderTopRightRadius: 10, height: '100%', width: '100%'}}
                  resizeMode={"cover"}
                  ></FastImage>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.95} onPress={() => (this.props.media.length>3)?Actions.viewMediaSet({"imageURI":this.props.media}):Actions.viewFullMedia({"media":"image","imageURI":this.props.media[2]})} style={{paddingTop: 1.5, height: '100%', width: '100%'}}>
                  <Image
                    blurRadius={10}
                    source={{uri: imageURL + this.props.media[2]}}
                    style={{height: '100%', borderBottomRightRadius: 10, width: '100%'}}
                    resizeMode={"cover"}
                  />
                  {(this.props.media.length>3)?
                  <View style={{borderBottomRightRadius: 10, position: "absolute", backgroundColor: "rgba(0,0,0,0.5)", height: '100%', width: '100%', justifyContent: "center", alignItems: "center"}}>
                    <TitleText color={"white"} size={35} type={"med"} text={"+ " + (this.props.media.length - 2)} />
                  </View>:<View></View>}
                </TouchableOpacity>
              </View>
          </View>}
        </View>:<View></View>}
        <View style={{marginTop: 5, height: 0.5, width: "90%", marginLeft: '5%', backgroundColor: "#cecece"}}></View>
        <View>
            <View style={{height: 'auto', width: '100%', flexDirection: "row"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this._toggleLike()} style={{height: 40,flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <View style={{paddingLeft: 15, paddingRight: 10, justifyContent: "center", alignItems: "center"}}>
                  {(this.state.liked)?<FAIcon size={18} name={"heart"} color={"red"} />:<Icon size={18} name={"heart"} color={"black"} />}
                </View>
                <TitleText size={16} type={"med"} text={this.state.likes} />
            </TouchableOpacity>
            {(this.state.allowComments)?<TouchableOpacity activeOpacity={0.8} onPress={() => this._openComments()} style={{height: 40, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
              <View style={{paddingLeft: 15, paddingRight: 10, justifyContent: "center", alignItems: "center"}}>
                <Icon size={18} name={"comment"} color={"black"} />
              </View>
              <TitleText size={16} type={"med"} text={this.state.commentsNumber} />
            </TouchableOpacity>:<View></View>}
            {(false)?
              <View>
            {(this.props.isPublic && this.state.allowSharing)?<TouchableOpacity activeOpacity={0.8} onPress={() => this.props.pass._openBottomMenu({"menuType":"share", "postid":this.props.postid, "postRef": this})} style={{height: 40, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
              <View style={{paddingLeft: 15, paddingRight: 10, justifyContent: "center", alignItems: "center"}}>
                <Icon size={18} name={"share"} color={"black"} />
              </View>
              <TitleText size={16} type={"med"} text={this.state.shares} />
            </TouchableOpacity>:<View></View>}
            </View>:<View></View>}
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  postMedia = () => {
    return(
      <View style={{padding: 3, marginTop: 5, height: 'auto', width: '100%'}}>
        {(this.props.type == 2)?
          <TouchableOpacity activeOpacity={0.95} onPress={() => this.setState({muted: !this.state.muted})} style={{borderRadius: 10, height: 'auto', width: '100%'}}>
            <Video
              ignoreSilentSwitch={"ignore"}//ignore
              source={{uri: this.props.media[0]}}
              style={{borderRadius: 10, height: this.state.heightScaled, width: screenWidth-6}}
              resizeMode={"cover"}
              repeat={true}
              paused={this.state.paused}
              muted={this.state.muted}
              onLoad={response => {
                const { width, height } = response.naturalSize;
                var heightScaled = height * ((screenWidth-6) / width);
                if(heightScaled > screenHeight*0.7){
                  heightScaled = screenHeight*0.7;
                }

                this.setState({
                  heightScaled,
                  paused: false
                });
              }}
              onProgress={(data) => {
                this.setState({
                  seekToTime: data.currentTime
                });
              }}
             />
             <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)']} style={{borderBottomLeftRadius: 10, borderBottomRightRadius: 10, position: "absolute", bottom: 0, width: '100%', height: 60}}>
               <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({paused: !this.state.paused})} style={{flexDirection: "row", justifyContent: "flex-end", position: "absolute", bottom: 0, left: 0, height: 40, width: 40}}>
                 {(!this.state.paused)?<Icon size={25} name={"pause"} color={"white"} />:<Icon size={25} name={"play"} color={"white"} />}
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({muted: !this.state.muted})}style={{flexDirection: "row", justifyContent: "flex-end", position: "absolute", bottom: 0, left: 50, height: 40, width: 40}}>
                 {(this.state.muted)?<Icon size={25} name={"volume-mute"} color={"white"} />:<Icon size={25} name={"volume-up"} color={"white"} />}
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.7} onPress={() => {
                 this.setState({paused: true});
                 Actions.viewFullMedia({"media":"video","videoURI":this.props.videoURI, "seekTo": this.state.seekToTime});
                }} style={{position: "absolute", bottom: 0, right: 0, height: 40, width: 40}}>
                 <Icon size={25} name={"expand"} color={"white"} />
               </TouchableOpacity>
             </LinearGradient>
          </TouchableOpacity>
          :
          (this.props.imageURI === undefined || this.props.imageURI.length == 1)?
        <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.imageURI[0]})} style={{borderRadius: 10, height: 'auto', width: '100%'}}>
          <FastImage
            source={{uri: this.props.imageURI[0], priority: FastImage.priority.normal}}
            style={{borderRadius: 10, height: screenWidth-6, width: screenWidth-6}}
            resizeMode={"cover"}
           ></FastImage>
        </TouchableOpacity>
        :(this.props.imageURI.length == 2)?
        <View style={{height: screenWidth-6, width: screenWidth-6, flexDirection: "row"}}>
          <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.imageURI[0]})} style={{paddingRight: 1.5, height: '100%', width: '50%'}}>
            <FastImage
              source={{uri: this.props.imageURI[0], priority: FastImage.priority.normal}}
              style={{borderTopLeftRadius: 10, borderBottomLeftRadius: 10, height: '100%', width: '100%'}}
              resizeMode={"cover"}
              ></FastImage>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.imageURI[1]})} style={{paddingLeft: 1.5, height: '100%', width: '50%'}}>
            <FastImage
              source={{uri: this.props.imageURI[1], priority: FastImage.priority.normal}}
              style={{borderTopRightRadius: 10, borderBottomRightRadius: 10, height: '100%', width: '100%'}}
              resizeMode={"cover"}
              ></FastImage>
          </TouchableOpacity>
        </View>
        :
        <View style={{height: 'auto', width: screenWidth-6, flexDirection: "row"}}>
          <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.imageURI[0]})} style={{paddingRight: 1.5, height: screenWidth*0.8, width: '60%'}}>
            <FastImage
              source={{uri: this.props.imageURI[0], priority: FastImage.priority.normal}}
              style={{borderTopLeftRadius: 10, borderBottomLeftRadius: 10, height: '100%', width: '100%'}}
              resizeMode={"cover"}
              ></FastImage>
          </TouchableOpacity>
          <View style={{paddingLeft: 1.5, height: screenWidth*0.4, width: '40%'}}>
            <TouchableOpacity activeOpacity={0.95} onPress={() => Actions.viewFullMedia({"media":"image","imageURI":this.props.imageURI[1]})} style={{paddingBottom: 1.5, height: '100%', width: '100%'}}>
              <FastImage
                source={{uri: this.props.imageURI[1], priority: FastImage.priority.normal}}
                style={{borderTopRightRadius: 10, height: '100%', width: '100%'}}
                resizeMode={"cover"}
                ></FastImage>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.95} onPress={() => (this.props.imageURI.length>3)?Actions.viewMediaSet({"imageURI":this.props.imageURI}):Actions.viewFullMedia({"media":"image","imageURI":this.props.imageURI[2]})} style={{paddingTop: 1.5, height: '100%', width: '100%'}}>
                <FastImage
                  source={{uri: this.props.imageURI[2], priority: FastImage.priority.normal}}
                  style={{borderBottomRightRadius: 10, height: '100%', width: '100%'}}
                  resizeMode={"cover"}
                ></FastImage>
                {(this.props.imageURI.length>3)?
                <View style={{position: "absolute", backgroundColor: "rgba(0,0,0,0.5)", height: '100%', width: '100%', justifyContent: "center", alignItems: "center"}}>
                  <TitleText color={"white"} size={35} type={"med"} text={"+ " + (this.props.imageURI.length - 3)} />
                </View>:<View></View>}
              </TouchableOpacity>
            </View>
        </View>}
      </View>
    );
  }

  postComments= () => {
    return(
      <View style={{borderColor: "rgba(75,0,130,0.25)", borderTopWidth: 3}}>
        {(this.props.commentsArray === undefined)?
          <View></View>
          :
          this.props.commentsArray.map(comment => {
          if(comment.first_name === undefined){
            return (<View></View>)
          }
          else{
            return(
              <Comment
                commentid={comment.commentid}
                avatar={comment.profile_picture}
                username={comment.first_name + ' ' + comment.last_name}
                likes={comment.likes}
                comment={comment.text}
                liked={comment.liked}
                userid={comment.userid}
                loading={comment.loading}
                time_submitted={comment.time_submitted}
              />)
          }
          })}
      </View>
    );
  }

  postSaySomething = () => {
    return(
      <View style={{padding: 10}}>
        <View style={{padding: 10, flexDirection: "row", backgroundColor: "#efefef", borderRadius: 10}}>
          <View style={{marginRight: 10}}>
            <Icon size={20} name={"feather"} color={"black"} />
          </View>
          <TextInput
            placeholder={"Say Something..."}
            style={{lineHeight: 18, fontSize: 18, fontFamily: "Quicksand-Regular", width: '85%'}}
            onChangeText={(val) => this._handleCommentType(val)}
            value={this.state.commentTyped}
            multiline
          />
          <TouchableOpacity activeOpacity={0.8} onPress={() => this._addComment()} style={{height: 30, width: 30,position: "absolute", bottom:0,right:0}}>
            <Icon size={20} name={"check-circle"} color={"black"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    console.disableYellowBox = true;

    return (
      <View>
          {/*this.postTopper()*/}
          {this.postCard()}
          <View style={{height: "auto", width: "100%", alignItems: "center", marginBottom: 15}}>
            {(this.props.commentsArray === undefined)?
              <View></View>
              :
              this.props.commentsArray.map(comment => {
              if(comment.first_name === undefined){
                return (<View></View>)
              }
              else{
                return(
                  <Comment
                    fullPost={this.props.fullPost}
                    isMine={comment.isMine}
                    commentid={comment.commentid}
                    profile_picture={comment.profile_picture}
                    username={comment.first_name + ' ' + comment.last_name}
                    likes={comment.likes}
                    comment={comment.text}
                    liked={comment.liked}
                    userid={comment.userid}
                    loading={comment.loading}
                    func={() => this._openFullPost()}
                    refreshCommentsFunc={this.props.refreshCommentsFunc}
                    time_submitted={comment.time_submitted}
                  />)
              }
              })}
          </View>
      </View>
   );
 }
}

export default Post;
