import React, {Component} from 'react';
import { StatusBar, ActivityIndicator, ImageBackground, TouchableOpacity, ScrollView, Dimensions, View, Text, TextInput,  } from 'react-native';

import { Actions } from 'react-native-router-flux';
import SearchInput, { createFilter } from 'react-native-search-filter';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Dialog from "react-native-dialog";
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image'
import { Switch } from 'react-native-switch';
import LinearGradient from 'react-native-linear-gradient';

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';

import NewChatTopNav from '../components/NewChatTopNav';
import Friend from '../components/Friend';

import { apiCall, imageURL } from '../utilities/Connector';
import globalassets  from '../utilities/global';
import GLOBAL from '../global';
import cache from '../in_memory_cache.js';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

var friendsToAdd = {};
const KEYS_TO_FILTERS = ['firstname_display', 'lastname', 'first_name', 'last_name'];
let tappedCreate = false;
let lastLeadingLetter = "";

var photoReference = "";

var defaultImage = "def0";

class NewChat extends Component {

  state = {
    isPrivate: true,
    addMembersDialog: false,
    imageLoading: false,
    searchTerm: '',
    circleName: "",
    noNameDialog: false,
    noFriendsDialog: false,
    friendsToAdd: {},
    groupPrivacy: "private",
    selectedType: "group",
    friends: (cache.in_memory_cache && cache.in_memory_cache['friends'])?cache.in_memory_cache['friends']:[],
    groupIcon: globalassets.main[defaultImage]
  }

  selectPicture = async () => {
    this.setState({
      imageLoading: true
    });
    var pass = this;
    const data = await ImagePicker.openPicker({
      mediaType: "photo",
      compressImageQuality: 0.8,
      forceJpg: true
    }).catch(e => {
      this.setState({
        imageLoading: false
      });
    })
    var maxWidth = 0;
    var maxHeight = 0;
    if(data.width > maxWidth){
      maxWidth = data.width;
    }
    if(maxWidth > 1200){
      maxWidth = 1200;
    }
    maxHeight = maxWidth*0.49;
    ImagePicker.openCropper({
      cropping: true,
      path: data.path,
      height: maxHeight,
      width: maxWidth,
    }).then(image => {
      this.uploadPicture({
        uri: image.path,
        type: image.mime,
        name: image.filename || `filename1.jpg`,
      });
    }).catch(e => {
      this.setState({
        imageLoading: false
      });
      alert("There was an issue with selecting this image, or you cancelled the selection.");
    });
  }

  uploadPicture = (source) => {

    var fd = new FormData();
    fd.append("token", GLOBAL.authToken)
    fd.append("imageFile", source)

  return fetch('https://rumine.ca/_apiv2/media/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    body: fd,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "dataerror"){
          if(responseJson.token != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error with this image. Please select another.");
        }
        else{
          if(responseJson.status == "wrongdata"){
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please restart the app.");
          }
          else {
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            photoReference = responseJson.status;
            this.setState({
              imageLoading: false,
              groupIcon: {uri: imageURL + responseJson.status, priority: FastImage.priority.normal}
            });
          }
        }
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        imageLoading: false
      });
      alert("We're sorry, there seems to be an error. Please try again later.")
    });

  }

  componentDidMount() {
  }

  onEnter = async () => {
    const friendsCall = await apiCall("/gw/ft/gaf",new FormData());
    var friendsParsed = friendsCall.status;
    this.setState({
      friends: friendsParsed
    })
    if(cache.in_memory_cache == undefined){
      cache.in_memory_cache = {};
    }
    if(cache.in_memory_cache['friends'] == undefined){
      cache.in_memory_cache['friends'] = {};
    }
    cache.in_memory_cache['friends'] = friendsParsed;
  }

  componentWillUnmount(){
    defaultImage = "def" + Math.floor(Math.random() * Math.floor(8));
    photoReference = "";
    friendsToAdd = {};
    setTimeout(function() {Actions.refresh({refresh: true})}, 500);
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

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  _addUserSelected = (obj) => {
    if(this.state.selectedType === 'group'){
      friendsToAdd[obj.userid] = true;
      this.setState({
        friendsToAdd: friendsToAdd
      });
    }
    else{
      Actions.chat({"id": obj.userid, "circleName": obj.name, "fromGroup": true})
    }
  }

  _removeUserSelected = (obj) => {
    friendsToAdd[obj.userid] = false;
    this.setState({
      friendsToAdd: friendsToAdd
    });
  }

  _createCircle = async () => {
    if(this.state.circleName.trim().length <= 0){
      alert("You must type a name for your group.");
      return;
    }
    this.setState({
      creatingGroup: true
    })
    var friendsToSend = [];
    //var atleastOneFriend = false;
    for (let [key, value] of Object.entries(friendsToAdd)) {
      if(value){
        //if(!atleastOneFriend){
        //  atleastOneFriend = true;
        //}
        friendsToSend.push(key);
      }
    }

    if(photoReference == ""){
      photoReference = defaultImage;
    }

    if(this.state.circleName.length > 0 && !tappedCreate){
      tappedCreate = true;
      var formdata = new FormData();
      formdata.append("name", this.state.circleName);
      formdata.append("friends", JSON.stringify(friendsToSend));
      formdata.append("isPrivate", this.state.isPrivate)
      formdata.append("isAnon", (this.state.groupPrivacy === "anon"))
      formdata.append("image", photoReference)
      const resp = await apiCall("/g/c", formdata);
      tappedCreate = false;
      if(resp.status == "fail"){
        if(resp.reason == "Incorrect data"){
          alert("There was a problem creating your group.");
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
        Actions.replace("groupTimeline",{groupid: data.groupid, groupName: this.state.circleName, isGroupAdmin: true, isPrivate: (this.state.groupPrivacy === "private"), isMember: true})
      }
    }
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

  _addMembers = () => {
    this.setState({
      addMembersDialog: false
    });
    alert("add members");
    Actions.pop();
  }

  render() {
    const filteredFriends = this.state.friends.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      //
      <Container>
      <StatusBar
         barStyle={"dark-content"}  // Here is where you change the font-color
        />
        <View>
          <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
            <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>New Group</Text>
            {(this.state.creatingGroup == undefined)?
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._createCircle()}  style={{position: "absolute", right: 0, height: '100%', paddingRight: 10, justifyContent: "center"}}>
              <TitleText size={16} text={"Create"} color={"#4080ff"} />
            </TouchableOpacity>
            :
            <View style={{position: "absolute", right: 0, height: '100%', paddingRight: 10, justifyContent: "center"}}>
              <ActivityIndicator size={"small"} color={"#4080ff"} />
            </View>
          }
          </View>
            <View style={{height: screenHeight-60}}>
              <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled = {true}>
            <View style={{display: (this.state.selectedType==='group')?"flex":"none"}}>
              <View style={{justifyContent: "center", alignItems: "center"}}>
                <View style={{height: 200, width: screenWidth, overflow: "hidden"}}>
                  <FastImage
                    source={this.state.groupIcon}
                    resizeMode={"cover"}
                    onError={() => this.setState({groupIcon: globalassets.main[defaultImage]})}
                    style={{height: '100%', width: '100%'}}>
                    <TouchableOpacity activeOpacity={(this.props.isGroupAdmin)?0.8:1} onPress={() => this.selectPicture()} style={{width: '100%', height: '100%', justifyContent: "center", alignItems: "center"}}>
                      {(this.state.imageLoading)?
                        <ActivityIndicator color={"white"} size="large" />
                        :
                      <View></View>}
                      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.5)']} style={{position: "absolute", bottom: 0, width: screenWidth, paddingTop: 50}}>
                        <View style={{position: "absolute", right: 10, bottom: 5}}>
                          <FAIcon name="plus" size={20} color={"white"} />
                        </View>
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
                      </LinearGradient>
                    </TouchableOpacity>
                  </FastImage>
                  </View>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, height: 'auto', width: screenWidth, backgroundColor: "white"}}>
                  <View>
                    <TitleText color={"#8c8c8c"} size={16} text={"Group Name"} />
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                        <TextInput
                          autoCorrect={false}
                          placeholder={"My new group"}
                          maxLength={32}
                          style={{
                            width: '100%',
                            paddingVertical: 0,
                            textAlignVertical: 'top',
                            padding: 10,
                            color: "black",
                            fontSize: 20,
                            fontFamily: "Raleway-Regular",
                            textAlign: "left"
                          }}
                          onTouchStart={() => this.setState({editingName: true})}
                          onChangeText={circleName => this.setState({circleName})}
                          defaultValue={this.state.circleName}
                        />
                      </View>
                  </View>
                </View>
                <View style={{marginTop: 25}}>
                  <TitleText extraStyle={{marginLeft: 10}} color={"#8c8c8c"} size={16} text={"Group Privacy"} />
                  <View style={{flexDirection: "row", height: 50, width: screenWidth, padding: 10, backgroundColor: "white", justifyContent: "space-between"}}>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                        <LineIcon name={"lock"} size={16} color={"black"} />
                        <TitleText extraStyle={{paddingLeft: 10}} size={20} text={"Private Group"} />
                      </View>
                      <Switch
                        useNativeDriver={true}
                        value={this.state.isPrivate}
                        onValueChange={(val) => {this.setState({isPrivate: val})}}
                        backgroundActive={'#6970ff'}
                      />
                    </View>
                </View>
            <View style={{paddingLeft: 10, paddingBottom: 10}}>
              {(this.state.isPrivate)?
              <View style={{padding: 5}}>
                <TitleText color={"#6e6e6e"} size={14} text={"This group will not appear in searches. New members must be added."} />
              </View>:
              <View style={{padding: 5}}>
                <TitleText color={"#6e6e6e"} size={14} text={"This group will appear in searches and can be joined by anyone."} />
              </View>}
            </View>
            {(this.state.groupPrivacy !== "anon")?
            <View>
              <View style={{paddingLeft: 10, marginTop: 25}}>
                <TitleText color={"#8c8c8c"} size={16} text={"Group Members"} />
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
              <View style={{height: screenHeight*0.4, width: '100%'}}>
                <ScrollView nestedScrollEnabled = {true}>
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
                    <View style={{height: 80, width: '100%'}}></View>
                  </ScrollView>
                  </View>
                </View>:<View></View>}
                </View>
                <View style={{height: 50, width: '100%'}}></View>
              </ScrollView>
            </View>
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
