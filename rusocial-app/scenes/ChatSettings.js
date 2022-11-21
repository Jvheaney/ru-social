import React, {Component} from 'react';
import { ActivityIndicator, Clipboard, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
//import QRCode from 'react-native-qrcode-svg';
//import PopoverTooltip from 'react-native-popover-tooltip';
import RBSheet from "react-native-raw-bottom-sheet";
import { Switch } from 'react-native-switch';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';

import SettingsButton from '../components/SettingsButton';
import TitleText from '../elements/TitleText';
import Container from '../elements/Container';
import FastImage from 'react-native-fast-image'

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

import { apiCall, imageURL } from '../utilities/Connector';
import global from '../utilities/global';
import cache from '../in_memory_cache.js';
import GLOBALdata from '../global';

let tappedReport = false;
let tappedDelete = false;
let tappedLeave = false;

let lastTappedChat = 0;
let lastTappedPost = 0;

let circleNameInstance = "";

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class ChatSettings extends Component {

  state = {
    shareurl: (GLOBALdata.shareurl)?GLOBALdata.shareurl:"",
    showCopied: false,
    loadingImage: false,
    isPrivate: this.props.isPrivate,
    reportCircleDialog: false,
    deleteCircleDialog: false,
    leaveCircleDialog: false,
    reportCircleMessage: "",
    circleName: this.props.circleName,
    editingName: false,
    isGroupAdmin: this.props.isGroupAdmin,
    imageid: (cache.in_memory_cache && cache.in_memory_cache['group_icons'] && cache.in_memory_cache['group_icons'][this.props.id])?cache.in_memory_cache['group_icons'][this.props.id]:"",
    chatNotificationsEnabled: (cache.in_memory_cache && cache.in_memory_cache['group_permissions'] && cache.in_memory_cache['group_permissions'][this.props.id] && cache.in_memory_cache['group_permissions'][this.props.id]["chat"])?cache.in_memory_cache['group_permissions'][this.props.id]["chat"]:false,
    postNotificationsEnabled: (cache.in_memory_cache && cache.in_memory_cache['group_permissions'] && cache.in_memory_cache['group_permissions'][this.props.id] && cache.in_memory_cache['group_permissions'][this.props.id]["post"])?cache.in_memory_cache['group_permissions'][this.props.id]["post"]:false,
    groupIcon: (cache.in_memory_cache && cache.in_memory_cache['group_icons'] && cache.in_memory_cache['group_icons'][this.props.id])?{uri: imageURL + cache.in_memory_cache['group_icons'][this.props.id], priority: FastImage.priority.normal}:global.main.groupicon,
    groupImageClean: (cache.in_memory_cache && cache.in_memory_cache['group_icons'] && cache.in_memory_cache['group_icons'][this.props.id])?cache.in_memory_cache['group_icons'][this.props.id]:global.main['def0']
  }

  onEnter = async() => {
    var formdata = new FormData();
    formdata.append("groupid", this.props.id);
    const resp = await apiCall("/g/i", formdata);
    if(resp.status == "success"){
      var data = JSON.parse(resp.data);
      this.setState({
        groupIcon: {uri: imageURL + data.image, priority: FastImage.priority.normal},
        circleName: data.name,
        isPrivate: data.isPrivate,
        isGroupAdmin: data.isGroupAdmin,
        imageid: data.image
      });
      if(cache.in_memory_cache['group_icons'] == undefined){
        cache.in_memory_cache['group_icons'] = {};
      }
      cache.in_memory_cache['group_icons'][data.groupid] = data.image;
    }
    this.getNotificationStatus();
  }

  componentDidMount() {
    circleNameInstance = this.props.circleName;
  }

  getNotificationStatus = async () => {
    var formdata = new FormData();
    formdata.append("groupid", this.props.id);
    const resp = await apiCall("/g/ggns", formdata);
    if(resp.status == "success"){
      var data = JSON.parse(resp.data);
      this.setState({
        chatNotificationsEnabled: data.chatNotifs,
        postNotificationsEnabled: data.postNotifs
      });
      if(cache.in_memory_cache['group_permissions'] == undefined){
        cache.in_memory_cache['group_permissions'] = {};
      }
      if(cache.in_memory_cache['group_permissions'][this.props.id] == undefined){
        cache.in_memory_cache['group_permissions'][this.props.id] = {};
      }
      cache.in_memory_cache['group_permissions'][this.props.id]["chat"] = data.chatNotifs;
      cache.in_memory_cache['group_permissions'][this.props.id]["post"] = data.postNotifs;
    }
  }

  _saveCircleSettings = () => {
    alert("Saved");
    Actions.pop();
  }

  _reportCircle = async () => {
    if(!tappedReport){
      tappedReport = true;
      this.setState({
        reportCircleDialog: false
      });
      if(this.state.reportCircleMessage.length>0){
        var formdata = new FormData();
        formdata.append("message", this.cleanSmartPunctuation(this.state.reportCircleMessage));
        formdata.append("groupid", this.props.id);
        const resp = await apiCall("/g/rg",formdata);
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

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _cancelReport = () => {
    this.setState({
      reportCircleDialog: false
    });
  }

  _reportCircleDialog = () => {
    this.setState({
      reportCircleDialog: true
    });
  }

  _cancelDelete = () => {
    this.setState({
      deleteCircleDialog: false
    });
  }

  _cancelLeave = () => {
    this.setState({
      leaveCircleDialog: false
    });
  }

  _deleteCircleDialog = () => {
    this.setState({
      deleteCircleDialog: true
    });
  }

  _editName = async () => {
    if(this.state.circleName.trim().length <= 0){
      alert("Your group requires a name.");
      return;
    }
    this.setState({
      editingName: false
    });
    if(this.state.circleName != circleNameInstance && this.state.circleName.length > 0){
        var formdata = new FormData();
        formdata.append("groupid", this.props.id);
        formdata.append("name", this.cleanSmartPunctuation(this.state.circleName));
        const resp = await apiCall("/g/e",formdata);
        tappedDelete = false;
        if(resp.status == "fail"){
          if(resp.reason == "Incorrect data"){
            alert("There was a problem changing this group's name.");
            this.setState({
              circleName: circleNameInstance
            });
          }
          else if(resp.reason == "Token failed"){
            Actions.replace("login");
          }
          else{
            alert("There was a problem with the server. Please try again later.");
            this.setState({
              circleName: circleNameInstance
            });
          }
        }
        else if(resp.status == "success"){
          //alert("The group name has been changed.");
          this.props.pass.setState({groupName: this.state.circleName});
          circleNameInstance = this.state.circleName;
        }
      }
  }

  _deleteCircle = async () => {
    if(!tappedDelete){
      tappedDelete = true;
      this.setState({
        deleteCircleDialog: false
      });
        var formdata = new FormData();
        formdata.append("groupid", this.props.id);
        const resp = await apiCall("/g/d",formdata);
        tappedDelete = false;
        if(resp.status == "fail"){
          if(resp.reason == "Incorrect data"){
            alert("There was a problem deleting this group.");
          }
          else if(resp.reason == "Token failed"){
            Actions.replace("login");
          }
          else{
            alert("There was a problem with the server. Please try again later.");
          }
        }
        else if(resp.status == "success"){
          Actions.pop();
          setTimeout(function() {
            Actions.pop();
          }, 500);
        }
      }
  }

  _leaveCircleDialog = () => {
    this.setState({
      leaveCircleDialog: true
    });
  }

  _copyPostURL = () => {
    Clipboard.setString(this.state.shareurl + this.props.id);
    this.setState({
      showCopied: true
    });
    var pass = this;
    setTimeout(function() {
      pass.setState({
        showCopied: false
      })
    }, 2000);
  }

  _selectProfilePicture = async () => {
    if(!this.props.isGroupAdmin || this.props.isGroupAdmin == undefined){
      return;
    }
    this.setState({
      loadingImage: true
    });
    var pass = this;
    const data = await ImagePicker.openPicker({
      mediaType: 'photo'
    }).catch(e => {
      this.setState({
        loadingImage: false
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
      pass.uploadImage(image);
      pass.setState({
        groupIcon: {uri: image.path},
      })
    }).catch(e => {
      this.setState({
        loadingImage: false
      });
    });
  }

  uploadImage = async(item) => {
    var data = new FormData();
    data.append("groupid",this.props.id);
    data.append("imageFile", {
      uri: item.path,
      type: item.mime,
      name: item.filename || `filename1.jpg`,
    });
    const resp = await apiCall("/g/ep",data);
    if(resp.status == "fail"){
      if(resp.reason == "Incorrect data"){
        alert("There was a problem changing the group image.");
        this.setState({
          loadingImage: false,
          groupIcon: (cache.in_memory_cache && cache.in_memory_cache['group_icons'] && cache.in_memory_cache['group_icons'][this.props.id])?{uri: imageURL + cache.in_memory_cache['group_icons'][this.props.id], priority: FastImage.priority.normal}:global.main.groupicon
        });
      }
      else if(resp.reason == "Token failed"){
        Actions.replace("login");
      }
      else{
        alert("There was a problem with the server. Please try again later.");
        this.setState({
          loadingImage: false,
          groupIcon: (cache.in_memory_cache && cache.in_memory_cache['group_icons'] && cache.in_memory_cache['group_icons'][this.props.id])?{uri: imageURL + cache.in_memory_cache['group_icons'][this.props.id], priority: FastImage.priority.normal}:global.main.groupicon
        });
      }
    }
    else if(resp.status == "success"){
      this.setState({
        loadingImage: false,
        groupIcon: {uri: imageURL + resp.data, priority: FastImage.priority.normal},
        groupImageClean: resp.data
      })
      if(cache.in_memory_cache['group_icons'] == undefined){
        cache.in_memory_cache['group_icons'] = {};
      }
      cache.in_memory_cache['group_icons'][this.props.id] = resp.data;
    }
  }

  _leaveCircle = async () => {

    if(!tappedLeave){
      tappedLeave = true;
      this.setState({
        leaveCircleDialog: false
      });
        var formdata = new FormData();
        formdata.append("groupid", this.props.id);
        const resp = await apiCall("/g/l",formdata);
        tappedLeave = false;
        if(resp.status == "fail"){
          if(resp.reason == "Incorrect data"){
            alert("There was a problem leaving this group.");
          }
          else if(resp.reason == "Token failed"){
            Actions.replace("login");
          }
          else{
            alert("There was a problem with the server. Please try again later.");
          }
        }
        else if(resp.status == "success"){
          Actions.pop();
          setTimeout(function() {
            Actions.pop();
          }, 500);
        }
      }
  }

  _addMembers = () => {
    Actions.addmembers({circleid: this.props.id, circleName: this.props.circleName});
  }

  _handleReportText = (message) => {
    this.setState({
      reportCircleMessage: message
    })
  }

  _openNotificationMenu = async() => {
    this.RBSheet.open();
  }

  _handleChatNotifiationChange = async(val) => {
    this.setState({
      chatNotificationsEnabled: val
    });
    lastTappedChat = new Date().getTime()
    setTimeout(async() => {
      const time = new Date().getTime();
      const delta = time - lastTappedChat;
      if(delta > 900){
        var formdata = new FormData();
        formdata.append("groupid", this.props.id);
        formdata.append("toggle", val);
        const resp = await apiCall("/g/tcn", formdata);
      }
    }, 1000)
  }

  _handlePostNotificationChange = (val) => {
    this.setState({
      postNotificationsEnabled: val
    });
    lastTappedPost = new Date().getTime();
    setTimeout(async() => {
      const time = new Date().getTime();
      const delta = time - lastTappedPost;
      if(delta > 900){
        var formdata = new FormData();
        formdata.append("groupid", this.props.id);
        formdata.append("toggle", val);
        const resp = await apiCall("/g/tpn", formdata);
      }
    }, 1000)
  }

  componentWillUnmount(){
    setTimeout(function() {Actions.refresh({refresh: true})}, 500);
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <Container
        >
        <StatusBar
           barStyle={"dark-content"}  // Here is where you change the font-color
          />
          <View>
            <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
              <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Group Settings</Text>
              <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
              </View>
            </View>
            <View style={{height: screenHeight-60}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <View style={{height: 200, width: screenWidth, overflow: "hidden"}}>
                    <FastImage
                      source={(this.state.groupImageClean && this.state.groupImageClean.length == 4 && this.state.groupImageClean.substring(0,3) == "def")?global.main[this.state.groupImageClean]:this.state.groupIcon}
                      resizeMode={"cover"}
                      onError={() => this.setState({groupImageClean: "def0"})}
                      style={{height: '100%', width: '100%'}}>
                      <TouchableOpacity activeOpacity={(this.props.isGroupAdmin)?0.8:1} onPress={() => this._selectProfilePicture()} style={{width: '100%', height: '100%'}}>
                        {(this.props.isGroupAdmin)?
                          (this.state.loadingImage)?
                          <View style={{justifyContent: "center", alignItems: "center", height: '100%', width: '100%'}}>
                            <ActivityIndicator color={"white"} size="large" />
                          </View>
                          :
                          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.5)']} style={{position: "absolute", bottom: 0, width: screenWidth, paddingTop: 50}}>
                            <View style={{position: "absolute", right: 10, bottom: 5}}>
                              <LineIcon name="pencil" size={20} color={"white"} />
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
                          :
                        <View></View>}
                      </TouchableOpacity>
                    </FastImage>
                    </View>
                  </View>
                  <View style={{minHeight: 'auto', width: screenWidth, marginTop: 15}}>
                    <View style={{flexDirection: "row", alignItems: "center", padding: 10, height: 'auto', width: screenWidth, backgroundColor: "white"}}>
                      <View>
                        <TitleText color={"#8c8c8c"} size={14} text={"Group Name"} />
                        {(this.props.isGroupAdmin)?
                          <View>
                          <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                              autoCorrect={false}
                              placeholder={"My group"}
                              maxLength={32}
                              style={{
                                paddingVertical: 0,
                                textAlignVertical: 'top',
                                minWidth: 150,
                                padding: 10,
                                color: "black",
                                fontSize: 20,
                                fontFamily: "Raleway-Regular",
                                textAlign: "left"
                              }}
                              onTouchStart={() => this.setState({editingName: true})}
                              //style={{minHeight: 100, borderColor: "#cecece", paddingLeft: 5, paddingRight: 5, lineHeight: 20, fontSize: 16, fontFamily: "Raleway-Regular", width: screenWidth-20}}
                              onChangeText={circleName => this.setState({circleName})}
                              defaultValue={this.state.circleName}
                            />
                            {(!this.state.editingName)?<LineIcon name="pencil" size={14} color={"black"} />:<View></View>}
                          </View>
                          {(this.state.editingName)?
                            <View style={{flexDirection: "row"}}>
                              <TouchableOpacity style={{padding: 5, paddingRight: 10, height: 50}} onPress={() => this.setState({editingName: false, circleName: this.props.circleName})} activeOpacity={0.7}>
                                <LineIcon name="close" size={25} color={"red"} />
                              </TouchableOpacity>
                              <TouchableOpacity style={{padding: 5}} onPress={() => this._editName()} activeOpacity={0.7}>
                                <LineIcon name="check" size={25} color={"green"} />
                              </TouchableOpacity>
                            </View>
                          :
                            <View style={{height: 50, width: '100%'}}></View>
                          }
                        </View>
                          :
                          <View style={{padding: 10, alignItems: "center", justifyContent: "center"}}>
                            <TitleText size={20} text={this.state.circleName} />
                          </View>
                        }
                      </View>
                    </View>
                  </View>
                  {((this.state.isGroupAdmin || !this.state.isPrivate) && this.state.shareurl != "" && this.state.shareurl != undefined)?
                  <View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => this._copyPostURL()} style={{width: screenWidth, height: 50, paddingLeft: 15, paddingRight: 15, flexDirection: "row", alignItems: "center"}}>
                      <View style={{height: 40, width: 40, borderRadius: 20, backgroundColor: "#6970ff", justifyContent: "center", alignItems: "center"}}>
                        <Icon name={"copy"} type={"med"} size={20} color={"white"} />
                      </View>
                      <TitleText extraStyle={{marginLeft: 5}} numberOfLines={1} size={18} color={"black"} text={"Copy Group Share URL"} />
                    </TouchableOpacity>
                    <TitleText extraStyle={{paddingLeft: 15, paddingRight: 15}} size={12} color={"#8c8c8c"} text={"Anybody with this URL can join your group, even if its private. Be careful who you share this with."} />
                    <View style={{height: 25, paddingLeft: 15, marginTop: 10}}>
                      {(this.state.showCopied)?<TitleText size={14} color={"green"} text={"Link copied to clipboard"} />:<View></View>}
                    </View>
                  </View>:<View></View>}
                  {(false)?
                  <View>
                  <View style={{left: 5}}><TitleText size={25} text={"Quick Join"} /></View>
                    <View style={{paddingBottom: 10, width: screenWidth, justifyContent: "center", alignItems: "center"}}>
                      <View style={{justifyContent: "center", alignItems: "center", backgroundColor: "#fff", height: screenWidth*0.6, width: screenWidth*0.6, borderRadius: 15}}>
                        <QRCode
                          value={"circjoin:" + this.props.id}
                          size={screenWidth*0.55}
                          color={"#9831cc"}
                        />
                      </View>
                      <PopoverTooltip
                        ref='tooltip1'
                        buttonComponent={
                            <TouchableOpacity onPress={() => {
                              this.refs['tooltip1'].toggle();
                              setTimeout(function(){if(this.refs['tooltip1'].state.isModalOpen){this.refs['tooltip1'].toggle()}}.bind(this), 1500);
                              Clipboard.setString('https://circjo.in/' + this.props.id)
                              }} style={{padding: 10}}>
                              <TitleText size={18} text={"https://circjo.in/" + this.props.id} />
                            </TouchableOpacity>
                        }
                        items={[
                          {
                            label: 'Copied!',
                          }
                        ]}
                        labelStyle={{color: "white"}}
                        labelContainerStyle={{backgroundColor: "#44ad44"}}
                        overlayStyle={{backgroundColor: "transparent"}}
                        animationType='spring'
                      />
                    </View>
                    </View>:<View></View>}
                    <View style={{left: 10}}>
                      <TitleText color={"#8c8c8c"} size={14} text={"Manage"} />
                    </View>
                  <SettingsButton
                    color={"gray"}
                    message={"See all members"}
                    icon={"user"}
                    func={() => Actions.groupMembers({"circleid": this.props.id, "isPrivate": this.state.isPrivate, "circleName": this.props.circleName, "isGroupAdmin": this.props.isGroupAdmin})}
                  />
                  <SettingsButton
                    color={"gray"}
                    message={"Toggle Notifications"}
                    icon={"bell"}
                    func={() => this._openNotificationMenu()}
                  />
                  <SettingsButton
                    color={"gray"}
                    message={"Report Group"}
                    icon={"exclamation"}
                    func={() => this._reportCircleDialog()}
                  />
                  {(this.props.isGroupAdmin)?
                    <SettingsButton
                      color={"red"}
                      message={"Delete Group"}
                      icon={"trash"}
                      func={() => this._deleteCircleDialog()}
                    />:
                    (this.props.isMember)?
                    <SettingsButton
                      color={"#6970ff"}
                      message={"Leave Group"}
                      icon={"close-o"}
                      func={() => this._leaveCircleDialog()}
                    />:<View></View>}
                    <View style={{height: 100, width: '100%'}}></View>
                  </ScrollView>
            </View>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={220}
              customStyles={{
                container: {
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  paddingLeft: 25,
                  paddingRight: 25
                }
              }}
              closeOnDragDown={true}
            >
              <View>
              <View style={{flexDirection: "row", height: 60, marginTop: 20, width: screenWidth-50, padding: 10, justifyContent: "space-between"}}>
                <TitleText size={18} text={"Chat Notifications"} />
                  <Switch
                    useNativeDriver={true}
                    value={this.state.chatNotificationsEnabled}
                    onValueChange={(val) => this._handleChatNotifiationChange(val)}
                    backgroundActive={'#6970ff'}
                  />
              </View>
              <View style={{flexDirection: "row", height: 60, width: screenWidth-50, padding: 10, justifyContent: "space-between"}}>
                <TitleText size={18} text={"Post Notifications"} />
                  <Switch
                    useNativeDriver={true}
                    value={this.state.postNotificationsEnabled}
                    onValueChange={(val) => this._handlePostNotificationChange(val)}
                    backgroundActive={'#6970ff'}
                  />
              </View>
              </View>
            </RBSheet>
            <View>
              <Dialog.Container visible={this.state.deleteCircleDialog}>
              <Dialog.Title>Delete {this.props.circleName}?</Dialog.Title>
              <Dialog.Description>
                This group will be deleted and all members will be removed. This cannot be undone.
              </Dialog.Description>
              <Dialog.Button onPress={() => this._cancelDelete()} label="Cancel" />
              <Dialog.Button onPress={() => this._deleteCircle()} label="Delete" />
              </Dialog.Container>
            </View>
            <View>
              <Dialog.Container visible={this.state.leaveCircleDialog}>
              <Dialog.Title>Leave {this.props.circleName}?</Dialog.Title>
              <Dialog.Description>
                You will have to rejoin to see new posts and updates.
              </Dialog.Description>
              <Dialog.Button onPress={() => this._cancelLeave()} label="Cancel" />
              <Dialog.Button onPress={() => this._leaveCircle()} label="Leave" />
              </Dialog.Container>
            </View>
            <View>
              <Dialog.Container visible={this.state.reportCircleDialog}>
              <Dialog.Title>Report {this.props.circleName}</Dialog.Title>
              <Dialog.Description>
                Why are you reporting this group?
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
              <Dialog.Button onPress={() => this._reportCircle()} label="Report" />
              </Dialog.Container>
            </View>
          </View>
      </Container>
   );
 }
}

export default ChatSettings;
