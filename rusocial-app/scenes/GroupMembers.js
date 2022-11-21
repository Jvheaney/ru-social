import React, {Component} from 'react';
import { StatusBar, Keyboard, TouchableOpacity, ScrollView, Dimensions, View, Text, TextInput,  } from 'react-native';

import { Actions } from 'react-native-router-flux';
import SearchInput, { createFilter } from 'react-native-search-filter';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Dialog from "react-native-dialog";
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import RBSheet from "react-native-raw-bottom-sheet";
import FAIcon from 'react-native-vector-icons/FontAwesome';

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';

import SettingsButton from '../components/SettingsButton';
import NewChatTopNav from '../components/NewChatTopNav';
import Friend from '../components/Friend';
import CircleMember from '../components/CircleMember';

import GLOBAL from '../global';
import { apiCall } from '../utilities/Connector';
import cache from '../in_memory_cache.js';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

let tappedCreate = false;
let lastLeadingLetter = "";

var friendsToAdd = {};
const KEYS_TO_FILTERS = ['firstname_display', 'lastname', 'first_name', 'last_name'];
class NewChat extends Component {

  state = {
    addFriendsIsOpen: false,
    addMembersDialog: false,
    searchTerm: '',
    groupMemberSearchTerm: '',
    circleName: "",
    noNameDialog: false,
    noFriendsDialog: false,
    friendsToAdd: {},
    friends: (cache.in_memory_cache && cache.in_memory_cache['friends'])?cache.in_memory_cache['friends']:[],
    groupMembers: (cache.in_memory_cache && cache.in_memory_cache['group_members'] && cache.in_memory_cache['group_members'][this.props.circleid])?cache.in_memory_cache['group_members'][this.props.circleid]:[],
    hasLoaded: (cache.in_memory_cache && cache.in_memory_cache['group_members'] && cache.in_memory_cache['group_members'][this.props.circleid])?true:false
  }

  onEnter = async () => {
      var formdata = new FormData();
      formdata.append("groupid", this.props.circleid)
      const groupMemberCall = await apiCall("/g/m",formdata);
      var groupMembersParsed = JSON.parse(groupMemberCall.data);
      this.setState({
        groupMembers: groupMembersParsed,
        hasLoaded: true
      })
      if(cache.in_memory_cache['group_members'] == undefined){
        cache.in_memory_cache['group_members'] = {};
      }
      cache.in_memory_cache['group_members'][this.props.circleid] = groupMembersParsed;
      this._fetchFriends();
  }

  _refreshGroupMembers = async() => {
    var formdata = new FormData();
    formdata.append("groupid", this.props.circleid)
    const groupMemberCall = await apiCall("/g/m",formdata);
    var groupMembersParsed = JSON.parse(groupMemberCall.data);
    this.setState({
      groupMembers: groupMembersParsed,
      hasLoaded: true
    })
    if(cache.in_memory_cache['group_members'] == undefined){
      cache.in_memory_cache['group_members'] = {};
    }
    cache.in_memory_cache['group_members'][this.props.circleid] = groupMembersParsed;
  }

  _fetchFriends = async () => {
      const friendsCall = await apiCall("/gw/ft/gaf",new FormData());
      var friendsParsed = friendsCall.status;
      this.setState({
        friends: friendsParsed
      })
      cache.in_memory_cache['friends'] = friendsParsed;
  }

  componentDidMount() {
  }

  componentWillUnmount(){
    friendsToAdd = {};
  }

  _closeName = () => {
    this.setState({
      noNameDialog: false
    })
  }

  _closeFriends = () => {
    this.setState({
      noFriendsDialog: false
    })
  }

  groupMemberSearchTerm(term) {
    this.setState({ groupMemberSearchTerm: term })
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  _addUserSelected = (obj) => {
    friendsToAdd[obj.userid] = true;
    this.setState({
      friendsToAdd: friendsToAdd
    });
  }

  _removeUserSelected = (obj) => {
    delete friendsToAdd[obj.userid]
    this.setState({
      friendsToAdd: friendsToAdd
    });
  }

  _createCircle = () => {
    friendsToAdd[obj.userid] = false;
    this.setState({
      friendsToAdd: friendsToAdd
    });
  }

  _createCircle = async () => {

  }

  _cancelCreate = () => {
    this.setState({
      addMembersDialog: false
    });
  }

  _createCircleDialog = () => {
    if(this.state.circleName.replace(/\s/g, "") == ""){
      this.setState({
        noNameDialog: true
      });
    }
    else if(friendsToAdd.length == 0){
      this.setState({
        noFriendsDialog: true
      });
    }
    else{
      this.setState({
        addMembersDialog: true
      });
    }
  }

  _handleCircleNameText = (message) => {
    this.setState({
      circleName: message
    })
  }

  _addMembers = async () => {
    var friendsToSend = [];
    var atleastOneFriend = false;
    for (let [key, value] of Object.entries(friendsToAdd)) {
      if(value){
        if(!atleastOneFriend){
          atleastOneFriend = true;
        }
        friendsToSend.push(key);
      }
    }
    if(atleastOneFriend && !tappedCreate){
      tappedCreate = true;
      var formdata = new FormData();
      formdata.append("friends", JSON.stringify(friendsToSend));
      formdata.append("groupid", this.props.circleid);
      const resp = await apiCall("/g/af", formdata);
      tappedCreate = false;
      if(resp.status == "fail"){
        if(resp.reason == "Incorrect data"){
          alert("There was a problem adding your friends.");
        }
        else if(resp.reason == "Token failed"){
          Actions.replace("login");
        }
        else{
          alert("There was a problem with the server. Please try again later.");
        }
      }
      else if(resp.status == "success"){
        this.RBSheet.close();
        this.setState({
          friendsToAdd: {},
          addFriendsIsOpen: false
        });
        setTimeout(()=> {
          alert("Your friends have been added");
          this._refreshGroupMembers();
        }, 500);
      }
    }
    else{
      if(!atleastOneFriend){
          alert("You must add at least one friend.");
      }
      else{
        this.RBSheet.close();
        this.setState({
          friendsToAdd: {},
          addFriendsIsOpen: false
        });
      }
    }
  }

  render() {
    const filteredFriends = this.state.friends.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    const filteredMembers = this.state.groupMembers.filter(createFilter(this.state.groupMemberSearchTerm, KEYS_TO_FILTERS))
    return (
      //
      <Container>
      <StatusBar
         barStyle={"dark-content"}  // Here is where you change the font-color
        />
        <View>
          <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
            <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Members</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {Keyboard.dismiss(); this.setState({ addFriendsIsOpen: true }); this.RBSheet.open();}} style={{position: 'absolute', height: 28, borderRadius: 10, backgroundColor: "#6970ff", width: 28, right: 20, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
              <FAIcon style={{marginTop: 1, marginLeft: 1}} name={"plus"} size={18} color={"white"} />
            </TouchableOpacity>
          </View>
            <ScrollView  showsVerticalScrollIndicator={false} style={{height: screenHeight-60}}>
              <View style={{paddingTop: 10, paddingLeft: 10}}>
                <TitleText size={18} text={"Group Members:"} />
              </View>
              <View style={{paddingLeft: 20, borderColor: "black", height: 50, width: screenWidth, backgroundColor: "white", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <EvilIcons size={30} name={"search"} color={"#aaa"} />
                <SearchInput
                  autoCorrect={false}
                  placeholder={"Search group members"}
                  placeholderTextColor={"#aaaaaa"}
                  onChangeText={(term) => { this.groupMemberSearchTerm(term) }}
                  style={{
                    fontFamily: "Raleway-Regular",
                    borderColor: "black",
                    width: screenWidth-20,
                    color: "black",
                    backgroundColor: "white",
                    padding: 5,
                    fontSize: 18}}
                  />
              </View>
              {filteredMembers.map(friend => {
                return (
                    <CircleMember
                      username={friend.first_name + " " + friend.last_name}
                      avatar={friend.profile_picture}
                      circleid={this.props.circleid}
                      userid={friend.userid}
                      isGroupAdmin={this.props.isGroupAdmin}
                      pass={this}
                    />
                  )
                })}
                {(this.state.groupMembers.length === 0 && this.state.hasLoaded)?
                  <View style={{width: '100%', alignItems: "center"}}>
                    <TitleText size={14} text={"You are the only member of this group."} />
                  </View>
                  :
                  <View></View>
                }
            </ScrollView>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              onClose={() => {this.setState({friendsToAdd: {}}); this.setState({searchTerm: ''})}}
              height={screenHeight*0.85}
              customStyles={{
                container: {
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  paddingLeft: 10,
                  paddingRight: 10
                }
              }}
              closeOnDragDown={true}
            >
              <View style={{height: (screenHeight*0.8)*0.1, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {if (Object.keys(this.state.friendsToAdd).length > 0){this._addMembers()}}}  style={{height: '80%', width: '80%', backgroundColor: (Object.keys(this.state.friendsToAdd).length > 0)?"#6970ff":"#dedede", justifyContent: "center", alignItems: "center", borderRadius: 15}}>
                  <TitleText size={16} color={"white"} text={"Add Friends"} />
                </TouchableOpacity>
              </View>
              <View style={{paddingLeft: 20, borderColor: "black", height: 50, width: screenWidth, backgroundColor: "white", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <EvilIcons size={30} name={"search"} color={"#aaa"} />
                <SearchInput
                  autoCorrect={false}
                  placeholder={"Search friends"}
                  placeholderTextColor={"#aaaaaa"}
                  onChangeText={(term) => { this.searchUpdated(term) }}
                  style={{
                    fontFamily: "Raleway-Regular",
                    borderColor: "black",
                    width: screenWidth-20,
                    color: "black",
                    backgroundColor: "white",
                    padding: 5,
                    fontSize: 18}}
                  />
              </View>
            {(this.state.addFriendsIsOpen)?<View style={{height: (screenHeight*0.85)*0.65}}>
              <ScrollView>
              {filteredFriends.map(friend => {
                var name;
                if(friend.lastname == undefined){
                  name = friend.firstname_display;
                }
                else{
                  name = friend.firstname_display + ' ' + friend.lastname
                }

                //Alphabetical Top Headers
                var leadingLetter = name.trim().toUpperCase()[0];
                var renderHeader = false;
                if(leadingLetter != lastLeadingLetter){
                  lastLeadingLetter = leadingLetter;
                  renderHeader = true;
                }
                return (
                  <>
                    {(renderHeader == true)?
                      <View style={{marginLeft: 10, marginTop: 10, marginBottom: 10, width: 40, height: 40, borderRadius: 10, backgroundColor: "#6970ff", justifyContent: "center", alignItems: "center"}}>
                        <TitleText size={18} color={"white"} text={lastLeadingLetter} />
                      </View>:<View></View>}
                    <Friend
                      isCreatingGroup={true}
                      username={name}
                      avatar={friend.image0}
                      userid={friend.userid}
                      added={(this.state.friendsToAdd[friend.userid])}
                      pass={this}
                    />
                  </>
                  )
                })}
                </ScrollView>
              </View>:<View></View>}
            </RBSheet>
            <View>
              <Dialog.Container visible={this.state.addMembersDialog}>
              <Dialog.Title>Create {this.state.circleName}?</Dialog.Title>
              <Dialog.Button onPress={() => this._cancelCreate()} label="Cancel" />
              <Dialog.Button onPress={() => this._createCircle()} label="Create" />
              </Dialog.Container>
            </View>
            <View>
              <Dialog.Container visible={this.state.noNameDialog}>
              <Dialog.Title>Circles Need a Name</Dialog.Title>
              <Dialog.Description>
                You need to add a name to your circle.
              </Dialog.Description>
              <Dialog.Button onPress={() => this._closeName()} label="Ok" />
              </Dialog.Container>
            </View>
            <View>
              <Dialog.Container visible={this.state.noFriendsDialog}>
              <Dialog.Title>Circles Need Friends</Dialog.Title>
              <Dialog.Description>
                You need to add friends to your circle.
              </Dialog.Description>
              <Dialog.Button onPress={() => this._closeFriends()} label="Ok" />
              </Dialog.Container>
            </View>
          </View>
      </Container>
   );
 }
}

export default NewChat;
