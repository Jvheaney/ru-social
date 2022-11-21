import React, {Component} from 'react';
import { Dimensions, ScrollView, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import RBSheet from "react-native-raw-bottom-sheet";

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';

import TopNav from '../components/TopNav';
import Post from '../components/Post';
import MakePostItem from '../components/MakePostItem';
import JoinGroupItem from '../components/JoinGroupItem';
import LowerPostMenu from '../components/LowerPostMenu';
import ShareMenu from '../components/ShareMenu';

import global from '../utilities/global';
import { apiCall } from '../utilities/Connector';

let screenHeight = Dimensions.get('window').height;

class Group extends Component {

  state = {
    isNotInGroup: this.props.isNotInGroup,
    groupPosts: (global.groupPosts[this.props.id] === undefined)?[]:global.groupPosts[this.props.id],
    bottomType: "share",
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

  onEnter = async() => {
    //if(global.blockedUsers.length == 0){
      var formdata = new FormData();
      formdata.append("groupid", this.props.id);
      const groupPostsCall = await apiCall("/g/gp",formdata);
      var gpcParsed = JSON.parse(groupPostsCall.data);
      this.setState({
        groupPosts: gpcParsed,
        loadingTimeline: false
      })
      global.groupPosts[this.props.id] = gpcParsed;
    //}
  }

  selectGroupTimeline = async (groupname, groupid) => {
    timelineNameChanged = true;
    if(groupid === "home"){
      this.setState({
        loadingTimeline: false,
        timelineName: groupname,
        timeline: global.timeline,
        selectedGroupid: "home",
      }, () => {this.getHomeTimeline()});
    }
    else{
      this.setState({
        loadingTimeline: true,
        timelineName: groupname,
        timeline: (global.groupPosts[groupid] === undefined)?[]:global.groupPosts[groupid],
        selectedGroupid: groupid
      }, function() {this.getGroupTimeline(groupid)});

    }

  }

  getGroupTimeline = async () => {
    var formdata = new FormData();
    formdata.append("groupid", this.props.id);
    const groupPostsCall = await apiCall("/g/gp",formdata);
    var gpcParsed = JSON.parse(groupPostsCall.data);
    this.setState({
      groupPosts: gpcParsed
    })
    global.groupPosts[this.props.id] = gpcParsed;
  }

  _openBottomMenu = (obj) => {
    shareSheetChanged = true;
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
      shareType: obj.shareType,
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
      />
    )
  }

  headerComponent = () => {
    if(this.state.isNotInGroup){
      return(
        <JoinGroupItem
          groupid={this.props.id}
          pass={this}
         />
      )
     }
     else{
       return(
         <MakePostItem
         sendToGroupID={this.props.id}
        />
       )
     }
  }

  footerComponent = () => {
    if(this.state.groupPosts.length == 0 && !this.state.loadingTimeline && !this.state.isNotInGroup){
      return (
        <View style={{height: 60, width: '100%', alignItems: "center", justifyContent: "center"}}>
          <TitleText size={18} text={"We couldn't find any posts!"} />
          <TouchableOpacity activeOpacity={0.75} onPress={() => Actions.makePost({"sendToGroupID": this.state.selectedGroupid})} style={{padding: 2}}><TitleText size={18} color={"blue"} text={"Start the conversation!"} /></TouchableOpacity>
        </View>
      )
    }
    else{
      return(<View></View>)
    }
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0) {
        this.setState({ currentVisibleIndex: viewableItems[0].index });
    }
  };

  render() {

    return (
      //
      <Container
      sabc={"white"}
      bc={"#FBFBF8"}
      >
            <View>
              <TopNav
                circleName={this.props.circleName}
                onBackClick={() => Actions.pop()}
                onChatClick={() => Actions.chat({"id": this.props.circleid, "circleName": this.props.circleName, "fromGroup": true})}
                onSettingsClick={() => Actions.chatSettings({"id": this.props.id, "circleName": this.props.circleName, "fromGroup": true, "isGroupAdmin": (global.groupAdmin[this.props.id] === undefined)?false:global.groupAdmin[this.props.id]})}
                fromChat={this.props.fromChat}
                onNavTap={() => this.refs['timeline'].scrollToOffset({ animated: true, offset: 0 })}
               />
              <View style={{height: screenHeight-60}}>
                  <FlatList
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
                     onRefresh={() => this.getGroupTimeline()}
                     refreshing={this.state.loadingTimeline}
                  />
              </View>
              <RBSheet
                ref={ref => {
                  this.RBSheet = ref;
                }}
                height={120}
              >
              <LowerPostMenu
                pass={this}
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
                  menuType={this.state.shareType}
                  postid={this.state.postid}
                 />
              </RBSheet>
            </View>
      </Container>
   );
 }
}

export default Group;
