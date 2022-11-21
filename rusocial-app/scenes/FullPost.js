import React, {Component} from 'react';
import { StatusBar, Keyboard, Animated, TouchableOpacity, ScrollView, Dimensions, View, Text, TextInput, ActivityIndicator, KeyboardAvoidingView  } from 'react-native';

import { Actions } from 'react-native-router-flux';
import SearchInput, { createFilter } from 'react-native-search-filter';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Dialog from "react-native-dialog";
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';

import Post from '../components/Post';
import LowerPostMenu from '../components/LowerPostMenu';
import ShareMenu from '../components/ShareMenu';

import { apiCall, imageURL } from '../utilities/Connector';
import GLOBAL from '../global'
import cache from '../in_memory_cache.js';

let tappedCreateComment = false;

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

let postRef;

let refs = {};


class FullPost extends Component {

  bottomType = '';
  postid = '';
  isMine = '';
  media = '';
  text = '';
  postType = 0;
  allowComments = '';
  allowSharing = '';

  state = {
    bottomHeight: 0,
    topNotchOffset: 0,
    bottomNotchOffset: 0,
    addMembersDialog: false,
    searchTerm: '',
    groupMemberSearchTerm: '',
    circleName: "",
    noNameDialog: false,
    noFriendsDialog: false,
    post: (cache.in_memory_cache && cache.in_memory_cache.posts && cache.in_memory_cache.posts[this.props.id] !== undefined)?cache.in_memory_cache.posts[this.props.id]:{},
    comments: (cache.in_memory_cache && cache.in_memory_cache.comments && cache.in_memory_cache.comments[this.props.id] !== undefined)?cache.in_memory_cache.comments[this.props.id]:[],
    postLoaded: (cache.in_memory_cache && cache.in_memory_cache.posts && cache.in_memory_cache.posts[this.props.id] !== undefined && cache.in_memory_cache.posts[this.props.id] !== undefined)?true:false,
    commentsLoaded: (cache.in_memory_cache && cache.in_memory_cache.comments && cache.in_memory_cache.comments[this.props.id] !== undefined)?true:false,
    bottomType: "share",
    shareType: "chat",
    postid: 0,
    commentTyped: ""
  }

  _openBottomMenu = (obj) => {
    postRef = obj.postRef;
    this.setState({
      bottomType: obj.menuType,
      postid: obj.postid,
      isMine: obj.isMine,
      media: obj.media,
      text: obj.text,
      postType: obj.type,
      allowComments: obj.allowComments,
      allowSharing: obj.allowSharing
    });
    this.RBSheet.open();
  }

  _openShareSheet = (obj) => {
    this.RBSheet.close();
    var pass = this;
    setTimeout(function() {
      pass.ShareSheet.open();
    }, 500);
  }

  onEnter = async() => {
    //if(global.blockedUsers.length == 0){
      var formdata = new FormData();
      formdata.append("postid", this.props.id);
      const getPostCall = await apiCall("/p/gp",formdata);
      var gpcParsed = JSON.parse(getPostCall.data);
      if(gpcParsed == null){
        return;
      }
      this.setState({
        post: gpcParsed,
        postLoaded: true
      })
      if(cache.in_memory_cache == undefined){
        cache.in_memory_cache = {};
      }
      if(cache.in_memory_cache.posts == undefined){
        cache.in_memory_cache.posts = {};
      }
      cache.in_memory_cache.posts[this.props.id] = gpcParsed;
      this._getCommentsForPost();
    //}
  }

  _getCommentsForPost = async() => {
    var formdata = new FormData();
    formdata.append("postid", this.props.id);
    const getPostCall = await apiCall("/p/gc",formdata);
    var gpcParsed = JSON.parse(getPostCall.data);
    this.setState({
      comments: gpcParsed,
      commentsLoaded: true
    });
    if(cache.in_memory_cache == undefined){
      cache.in_memory_cache = {};
    }
    if(cache.in_memory_cache.comments == undefined){
      cache.in_memory_cache.comments = {};
    }
    cache.in_memory_cache.comments[this.props.id] = gpcParsed;
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _handleCommentType = (val) => {
    this.setState({
      commentTyped: val
    })
  }

  _addComment = async () => {
    var arr = this.state.comments;
    var commentInstance = this.state.commentTyped;
    if(commentInstance.trim().length <= 0){
      return;
    }
    if(this.state.post.userid == "-1"){
      //arr.push({"first_name": global.main.anon_name, "last_name": "", "userid": "-1", "text": commentInstance, "profile_picture": "anon", "liked":false,"likes":0, "loading": true});
    }
    else{
      arr.push({"first_name": GLOBAL.friends.firstname_display, "last_name": GLOBAL.friends.lastname, "userid": "me", "text": commentInstance, "profile_picture": GLOBAL.friends.image0, "liked":false,"likes":0, "loading": true, "isMine": true});
    }
    this.setState({
      comments: arr,
      commentTyped: ""
    });
    //this.refs['postscrollview'].scrollToEnd({animated:true});
    if(commentInstance.length > 0 && !tappedCreateComment){
      tappedCreateComment = true;
      var formdata = new FormData();
      formdata.append("postid", this.state.post.postid);
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
        arr = this.state.comments;
        var obj = arr[arr.length-1];
        obj.loading = false;
        obj.commentid = resp.data;
        arr[arr.length - 1] = obj;
        this.setState({
          commentsArray: arr
        });
      }
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide.bind(this));
    this.setState({
      topNotchOffset: StaticSafeAreaInsets.safeAreaInsetsTop,
      bottomNotchOffset: (StaticSafeAreaInsets.safeAreaInsetsBottom == 0)?40:StaticSafeAreaInsets.safeAreaInsetsBottom,
      bottomHeight: (StaticSafeAreaInsets.safeAreaInsetsBottom == 0)?40:StaticSafeAreaInsets.safeAreaInsetsBottom
    });
  }

  componentWillUnmount(){
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
      setTimeout(function() {Actions.refresh({refresh: true})}, 500);
  }

  _keyboardDidShow(e) {
    var addHeight = 0;
    if(StaticSafeAreaInsets.safeAreaInsetsBottom == 0 && Platform.OS == "ios"){
      addHeight = 35;
    }
    this.setState({ bottomHeight: e.endCoordinates.height + 5 + addHeight})
}

  _keyboardDidHide() {
    this.setState({ bottomHeight: this.state.bottomNotchOffset })
  }

  render() {
    return (
      //
      <Container
      sabc={"white"}
      bc={"#FBFBF8"}
      >
      <StatusBar
         barStyle={"dark-content"}  // Here is where you change the font-color
        />
        <View style={{height: 40, width: '100%', flexDirection: "row", backgroundColor: "white", justifyContent: "space-between", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.pop()} style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
          <LineIcon size={20} name={"arrow-left"} color={"black"} />
          </TouchableOpacity>
          </View>
            <View style={{height: '100%'}}>
            <KeyboardAvoidingScrollView>
            <View style={{paddingTop: 10}}>
            {(this.state.postLoaded)?<Post
              fullPost={true}
              inCircle={false}
              username={this.state.post.first_name + ' ' + this.state.post.last_name}
              profile_picture={this.state.post.profile_picture}
              circleName={this.state.post.name}
              userid={this.state.post.userid}
              postid={this.state.post.postid}
              groupid={this.state.post.groupid}
              isPublic={!this.state.post.isPrivate}
              bookmarked={true}
              media={this.state.post.media}
              text={this.state.post.text}
              comments={this.state.post.comments}
              liked={this.state.post.liked}
              likes={this.state.post.likes}
              shares={this.state.post.shares}
              commentsArray={this.state.comments}
              type={this.state.post.type}
              isMine={this.state.post.isMine}
              allowSharing={this.state.post.allowSharing}
              allowComments={this.state.post.allowComments}
              time_submitted={this.state.post.time_submitted}
              pass={this}
              refreshCommentsFunc={() => this._getCommentsForPost()}
              currentIndex={0}
              currentVisibleIndex={0}
            />
          :<View style={{padding: 20}}>
              <ActivityIndicator size="large" color="#4080ff" />
            </View>}
            </View>
            {(this.state.commentsLoaded)?<View></View>
            :
            (this.state.postLoaded)?<View style={{padding: 20}}>
              <ActivityIndicator size="small" color="#4080ff" />
            </View>:<View></View>}
            <View style={{height: 125, width: '100%'}}></View>
          </KeyboardAvoidingScrollView>
             {(!this.state.postLoaded)?
               <View></View>
               :
               (this.state.post == undefined)?
               <View></View>
               :
               (!this.props.isMember)?
               <View></View>
               :
               (this.state.post.allowComments)?
               <View style={{position: "absolute", bottom: this.state.bottomHeight-10, padding: 10, paddingBottom: 20, backgroundColor: "white", width: '100%', alignItems: "center", justifyContent: "center"}}>
               <View style={{padding: 5, flexDirection: "row", backgroundColor: "#efefef", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
                 <TextInput
                   placeholder={"Say Something..."}
                   maxLength={1024}
                   style={{paddingVertical: 0, textAlignVertical: 'center', paddingLeft: '1%', lineHeight: 16, fontSize: 16, fontFamily: "Raleway-Regular", width: '89%'}}
                   onChangeText={(val) => this._handleCommentType(val)}
                   value={this.state.commentTyped}
                   multiline
                 />
                 <TouchableOpacity activeOpacity={0.8} onPress={() => this._addComment()} style={{width: '10%', justifyContent: "center", alignItems: "center"}}>
                   <TitleText size={14} color={"#4080ff"} text={"Post"} />
                 </TouchableOpacity>
               </View>
             </View>
              :
              <View style={{position: "absolute", bottom: 0, height: 60+this.state.bottomHeight, backgroundColor: "white", width: screenWidth, justifyContent: "center", alignItems: "center"}}>
                <View style={{height: '60%'}}>
                  <TitleText size={14} text={"This user has turned off comments."} />
                </View>
              </View>
              }
            </View>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={150}
              customStyles={{
                container: {
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40
                }
              }}
              closeOnDragDown={true}
            >
            <LowerPostMenu
              pass={this}
              postRef={postRef}
              menuType={this.state.bottomType}
              postid={this.state.postid}
              isMine={this.state.isMine}
              media={this.state.media}
              text={this.state.text}
              postType={this.state.postType}
              allowSharing={this.state.allowSharing}
              allowComments={this.state.allowComments}
              isFullPost
             />
            </RBSheet>
            <RBSheet
              ref={ref => {
                this.ShareSheet = ref;
              }}
              height={screenHeight*0.55}
              customStyles={{
                container: {
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40
                }
              }}
              closeOnDragDown={true}
            >
              <ShareMenu
                pass={this}
               />
            </RBSheet>
      </Container>
   );
 }
}

export default FullPost;
