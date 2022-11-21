import React, {Component} from 'react';
import { FlatList, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import RBSheet from "react-native-raw-bottom-sheet";
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import ADIcon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import GroupListItem from '../components/GroupListItem';
import CreatePostItem from '../components/CreatePostItem';
import Post from '../components/Post';
import TitleText from '../elements/TitleText';

import JoinGroupItem from '../components/JoinGroupItem';
import LowerPostMenu from '../components/LowerPostMenu';
import ShareMenu from '../components/ShareMenu';

import GLOBAL from '../global.js';
import GLOBALassets from '../utilities/global';
import { apiCall } from '../utilities/Connector';
import AsyncStorage from '@react-native-community/async-storage';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';


import navlogo from '../assets/images/NBF.png';
import cache from '../in_memory_cache.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let initTimelineGetTime = 0;
let alreadyCallingTimeline = false;
let shareSheetChanged = false;
let lastLength = 99;
let postRef;

class Swipe extends Component {

  componentDidMount() {
    this.setState({
      topNotchOffset: StaticSafeAreaInsets.safeAreaInsetsTop,
      bottomNotchOffset: StaticSafeAreaInsets.safeAreaInsetsBottom
    });
    lastLength = 99;
    this.getGroupTimeline();
    this.getGroupDetails();
  }

  getGroupDetails = async () => {
    var formdata = new FormData();
    formdata.append("groupid", this.props.groupid);
    const resp = await apiCall("/g/i", formdata);
    if(resp.status == "success"){
      var data = JSON.parse(resp.data);
      this.setState({
        isMember: data.isMember,
        groupName: data.name,
        isGroupAdmin: data.isGroupAdmin,
        isPrivate: data.isPrivate,
        groupImage: {uri: 'https://rumine.ca/_i/s/i.php?i=' + data.image, priority: FastImage.priority.normal},
        groupImageClean: data.image
      });
      if(cache.in_memory_cache['group_icons'] == undefined){
        cache.in_memory_cache['group_icons'] = {};
      }
      cache.in_memory_cache['group_icons'][data.groupid] = data.image;
    }
  }


  componentWillReceiveProps(){
    this.getGroupTimeline();
    this.getGroupDetails();
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  componentWillUnmount(){
    lastLength = 99;
    setTimeout(function() {Actions.refresh({refresh: true})}, 500);
  }

  state = {
    topNotchOffset: 0,
    bottomNotchOffset: 0,
    isPrivate: this.props.isPrivate,
    isGroupAdmin: this.props.isGroupAdmin,
    isMember: this.props.isMember,
    groupPosts: (cache.in_memory_cache && cache.in_memory_cache['group_timelines'] && cache.in_memory_cache['group_timelines'][this.props.groupid])?cache.in_memory_cache['group_timelines'][this.props.groupid]:[],
    bottomType: "share",
    groupName: this.props.groupName,
    groupImage: {uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.image, priority: FastImage.priority.normal},
    groupImageClean: this.props.image,
    shareType: "chat",
    postid: 0,
    loadingTimeline: true,
    currentVisibleIndex: 0,
    isMine: false,
    media: [],
    text: "",
    postType: 0,
    allowSharing: false,
    allowComments: false
  }

  getGroupTimeline = async (fromBottom) => {
    if(fromBottom && lastLength < 15){
      return;
    }
    if(alreadyCallingTimeline){
      return;
    }
    alreadyCallingTimeline = true;
    var formdata = new FormData();
    formdata.append("groupid", this.props.groupid);
    if(fromBottom){
      formdata.append("offset", this.state.groupPosts.length);
      formdata.append("before_time", initTimelineGetTime);
    }
    else{
      initTimelineGetTime = new Date().getTime();
      formdata.append("offset", 0);
      formdata.append("before_time", initTimelineGetTime);
    }
    const groupPostsCall = await apiCall("/g/gp",formdata);
    alreadyCallingTimeline = false;
    var gpcParsed = JSON.parse(groupPostsCall.data);
    if(fromBottom){
      lastLength = gpcParsed.length;
      this.setState({
        groupPosts: this.state.groupPosts.concat(gpcParsed),
        loadingTimeline: false
      });
    }
    else{
      lastLength = 99;
      this.setState({
        groupPosts: gpcParsed,
        loadingTimeline: false
      });
      if(cache.in_memory_cache.group_timelines == undefined || cache.in_memory_cache.group_timelines == null){
        cache.in_memory_cache.group_timelines = {};
      }
      cache.in_memory_cache['group_timelines'][this.props.groupid] = gpcParsed;
    }

  }

  _openBottomMenu = (obj) => {
    shareSheetChanged = true;
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
    shareSheetChanged = true;
    this.setState({
      postid: obj.postid
    },function() {
      var pass = this;
      setTimeout(function() {
        pass.ShareSheet.open();
      }, 500);
    });
  }

  renderPost = (item, index) => {
    return (
      <Post
        key={item.postid}
        inCircle={true}
        isMember={this.state.isMember}
        username={item.first_name + ' ' + item.last_name}
        profile_picture={item.profile_picture}
        circleName={item.name}
        userid={item.userid}
        postid={item.postid}
        isPublic={!item.isPrivate}
        bookmarked={true}
        media={item.media}
        text={item.text}
        comments={item.comments}
        liked={item.liked}
        likes={item.likes}
        shares={item.shares}
        commentsArray={item.comment}
        type={item.type}
        isMine={item.isMine}
        allowSharing={item.allowSharing}
        allowComments={item.allowComments}
        pass={this}
        currentIndex={index}
        currentVisibleIndex={this.state.currentVisibleIndex}
        time_submitted={item.time_submitted}
      />
    )
  }

  headerComponent = () => {
    if(!this.state.isMember){
      return(
        <View>
          <View style={{height: 200, width: screenWidth, backgroundColor: "gray"}}>
          <FastImage
            source={(this.state.groupImageClean && this.state.groupImageClean.length == 4 && this.state.groupImageClean.substring(0,3) == "def")?GLOBALassets.main[this.state.groupImageClean]:this.state.groupImage}
            resizeMode={"cover"}
            onError={() => this.setState({groupImageClean: "def0"})}
            style={{height: '100%', width: '100%'}}>
            <LinearGradient colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.45)', 'transparent']} style={{position: "absolute", top: 0, width: screenWidth}}>
              <View style={{paddingTop: (Platform.OS == "android")?10:this.state.topNotchOffset, paddingBottom: 20}}>
                <View style={{height: '100%', width: '100%', flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 35, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="white" /></TouchableOpacity>
                <Text numberOfLines={1} style={{maxWidth: '50%', fontSize: (this.state.groupName.length>16)?20:25, textAlign: "center", color: "white", fontFamily: "Raleway-Bold"}}>{this.state.groupName}</Text>
                <View style={{height: 50, width: 'auto', position: "absolute", right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                </View>
                </View>
              </View>
            </LinearGradient>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.5)']} style={{position: "absolute", bottom: 0, width: screenWidth, paddingTop: 50}}>
              {(this.state.isPrivate)?
                <View style={{padding: 5, position: "absolute", left: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <LineIcon name="lock" size={12} color={"white"} />
                  <TitleText extraStyle={{marginLeft: 4}} color={"white"} size={16} text={"Private Group"} />
                </View>
                :
                <View style={{padding: 5, position: "absolute", left: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <LineIcon name="globe" size={12} color={"white"} />
                  <TitleText extraStyle={{marginLeft: 4}} color={"white"} size={16} text={"Public Group"} />
                </View>}
                {(this.state.isGroupAdmin)?
                  <View style={{padding: 5, position: "absolute", right: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <View style={{marginTop: 5, backgroundColor: "#FFD700", width: 80, height: 25, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Admin</Text>
                  </View>
                  </View>
                :(this.state.isMember)?
                <View style={{padding: 5, position: "absolute", right: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <View style={{marginTop: 5, backgroundColor: "#3aa14b", width: 80, height: 25, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 15, color: "white", fontFamily: "Raleway-Regular"}}>Member</Text>
                  </View>
                </View>:<View></View>
              }
            </LinearGradient>
            </FastImage>
          </View>
          <JoinGroupItem
            groupid={this.props.groupid}
            pass={this}
          />
        </View>
      )
     }
     else{
       return(
         <View>
          <View style={{height: 200, width: screenWidth, backgroundColor: "gray"}}>
          <FastImage
            source={(this.state.groupImageClean && this.state.groupImageClean.length == 4 && this.state.groupImageClean.substring(0,3) == "def")?GLOBALassets.main[this.state.groupImageClean]:this.state.groupImage}
            resizeMode={"cover"}
            onError={() => this.setState({groupImageClean: "def0"})}
            style={{height: '100%', width: '100%'}}>
            <LinearGradient colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.45)', 'transparent']} style={{position: "absolute", top: 0, width: screenWidth}}>
              <View style={{paddingTop: (Platform.OS == "android")?10:this.state.topNotchOffset, paddingBottom: 20}}>
                <View style={{height: '100%', width: '100%', flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 35, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="white" /></TouchableOpacity>
                <Text numberOfLines={1} style={{maxWidth: '50%', fontSize: (this.state.groupName.length>16)?20:25, textAlign: "center", color: "white", fontFamily: "Raleway-Bold"}}>{this.state.groupName}</Text>
                <View style={{height: 50, width: 'auto', position: "absolute", right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                  {(this.state.isMember && !this.props.fromGroupChat)?<TouchableOpacity style={{height: 35, width: 35, alignItems: "center", justifyContent: "center"}} activeOpacity={0.4} onPress={() => Actions.matchConvo({fromGroupTimeline: true, matchid: this.props.groupid, avatar: (this.state.groupImageClean && this.state.groupImageClean.length == 4 && this.state.groupImageClean.substring(0,3) == "def")?this.state.groupImageClean:'https://rumine.ca/_i/s/i.php?i=' + this.state.groupImageClean, username: this.state.groupName, userid: this.props.groupid, _type:2})}><FAIcon5 style={{}} name="comment-dots" size={20} color="white" /></TouchableOpacity>:<View></View>}
                  {(this.state.isMember)?
                  <TouchableOpacity activeOpacity={0.4} onPress={() => Actions.chatSettings({"id": this.props.groupid, "circleName": this.state.groupName, "fromGroup": true, "isGroupAdmin": this.state.isGroupAdmin, "isPrivate": this.state.isPrivate, "pass": this, "isMember": this.state.isMember})} style={{height: 35, width: 35, alignItems: "center", justifyContent: "center"}}>
                    <FAIcon style={{}} name="gear" size={20} color="white" />
                  </TouchableOpacity>:<View></View>}
                </View>
                </View>
              </View>
            </LinearGradient>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.5)']} style={{position: "absolute", bottom: 0, width: screenWidth, paddingTop: 50}}>
              {(this.state.isPrivate)?
                <View style={{padding: 5, position: "absolute", left: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <LineIcon name="lock" size={12} color={"white"} />
                  <TitleText extraStyle={{marginLeft: 4}} color={"white"} size={16} text={"Private Group"} />
                </View>
                :
                <View style={{padding: 5, position: "absolute", left: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <LineIcon name="globe" size={12} color={"white"} />
                  <TitleText extraStyle={{marginLeft: 4}} color={"white"} size={16} text={"Public Group"} />
                </View>}
                {(this.state.isGroupAdmin)?
                  <View style={{padding: 5, position: "absolute", right: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <View style={{marginTop: 5, backgroundColor: "#FFD700", width: 80, height: 25, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 15, color: "black", fontFamily: "Raleway-Regular"}}>Admin</Text>
                  </View>
                  </View>
                :
                <View style={{padding: 5, position: "absolute", right: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <View style={{marginTop: 5, backgroundColor: "#3aa14b", width: 80, height: 25, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 15, color: "white", fontFamily: "Raleway-Regular"}}>Member</Text>
                  </View>
                </View>
              }
            </LinearGradient>
            </FastImage>
          </View>
          <CreatePostItem
            sendToGroupID={this.props.groupid}
          />
        </View>
       )
     }
  }

  footerComponent = () => {
    if(this.state.groupPosts.length == 0 && !this.state.loadingTimeline && this.state.isMember){
      return (
        <View style={{height: 60, width: '100%', alignItems: "center", justifyContent: "center"}}>
          <TitleText size={18} text={"We couldn't find any posts!"} />
          <TouchableOpacity activeOpacity={0.75} onPress={() => Actions.makePost({"sendToGroupID": this.props.groupid})} style={{padding: 2}}><TitleText size={18} color={"blue"} text={"Start the conversation!"} /></TouchableOpacity>
        </View>
      )
    }
    else{
      return(<View style={{height: 100, width: '100%'}}></View>)
    }
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0) {
        this.setState({ currentVisibleIndex: viewableItems[0].index });
    }
  };


  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{height: screenHeight, width: screenWidth, backgroundColor: "#f8f8ff"}}>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "#f8f8ff"
      }}>
      <StatusBar
        barStyle="light-content" // Here is where you change the font-color
        />
        <View style={{height: '100%'}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ref='timeline'
              style={{height: screenHeight-100}}
              ListHeaderComponent={this.headerComponent}
              ListFooterComponent={this.footerComponent}
              data={this.state.groupPosts}
              renderItem={({item, index}) => this.renderPost(item, index)}
               //keyExtractor={item => item.postid}
               ItemSeparatorComponent = { this.FlatListItemSeparator }
               //removeClippedSubviews={true} // Unmount components when outside of window
               initialNumToRender={4} // Reduce initial render amount
               maxToRenderPerBatch={4} // Reduce number in each render batch
               updateCellsBatchingPeriod={200} // Increase time between renders
               windowSize={21} // Reduce the window size
               onViewableItemsChanged={this.onViewableItemsChanged}
               viewabilityConfig={{
                itemVisiblePercentThreshold: 50
               }}
               onRefresh={() => {this.getGroupTimeline(); this.getGroupDetails()}}
               refreshing={this.state.loadingTimeline}
               onEndReached={() => {this.getGroupTimeline(true)}}
               onEndReachedThreshold={0}
            />
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
          isMember={this.state.isMember}
          menuType={this.state.bottomType}
          postid={this.state.postid}
          isMine={this.state.isMine}
          media={this.state.media}
          text={this.state.text}
          postType={this.state.postType}
          allowSharing={this.state.allowSharing}
          allowComments={this.state.allowComments}
         />
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.ShareSheet = ref;
          }}
          height={400}
        >
          <ShareMenu
            pass={this}
            menuType={"post"}
            postid={this.state.postid}
           />
        </RBSheet>
      </View>
    </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
