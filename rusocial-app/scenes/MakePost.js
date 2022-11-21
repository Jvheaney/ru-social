import React, {Component} from 'react';
import { StatusBar, ActivityIndicator, Keyboard, TextInput, Image, TouchableOpacity, Dimensions, ScrollView, View, Text } from 'react-native';

import { Actions } from 'react-native-router-flux';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import { Switch } from 'react-native-switch';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image'

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';
import CheckButton from '../elements/CheckButton';
import GroupListItemShare from '../components/GroupListItemShare';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

import GLOBAL from '../global';
import { apiCall, imageURL } from '../utilities/Connector';
import cache from '../in_memory_cache.js';

let tappedCreate = false;

var mediaToUpload = [];

var friendsToAdd = {};
class MakePost extends Component {

  sentImages = {};

  state = {
    uploadingImage: 0,
    showCamera: false,
    showCameraPreview: false,
    addedVideo: false,
    allowVideo: false,
    paused: false,
    imageURI: [],
    dataType: "",
    videoURI: "",
    postTyped: "",
    searchTerm: "",
    selectedGroups: {},
    groups: (cache.in_memory_cache && cache.in_memory_cache['groups_screen'])?cache.in_memory_cache['groups_screen']:[],
    allowComments: true,
    allowShares: true
  }

  onExit = () => {
    mediaToUpload = [];
  }

  componentDidMount = () => {
    if(this.props.open === 'camera'){
      this.setState({showCamera: true});
    }
    else if(this.props.open === 'images'){
      this.selectPicture();
    }

    if(this.props.fromCamera){

      if(this.props.isImage && this.sentImages[this.props.media.path] === undefined){
        this.sentImages[this.props.media.path] = true;
        this.useURI({"isImage":true, "uri": this.props.uri});
        mediaToUpload.push({
          uri: this.props.media.uri,
          type: this.props.media.mime,
          name: this.props.media.filename || `filename1.jpg`,
        });
      }
      else if(this.sentImages[this.props.media.path] === undefined){
        hasSentInitial = true;
        this.useURI({"isImage":false, "uri": this.props.uri});
      }
    }

    if(this.props.sendToGroupID){
      var obj = {};
      obj[this.props.sendToGroupID] = true;
      this.setState({
        selectedGroups: obj
      })
    }
  }

  _toggleCircle = (id) => {
    if(this.state.selectedGroups[id]){
      var obj = this.state.selectedGroups;
      obj[id] = false;
      this.setState({
        selectedGroups: obj
      })
    }
    else{
      var obj = this.state.selectedGroups;
      obj[id] = true;
      this.setState({
        selectedGroups: obj
      })
    }
  }

  _viewFullImage = (image) => {
    Keyboard.dismiss();
    Actions.viewFullMedia({"media":"image","imageURI":image, "onMakePost": true})
  }

  _viewFullVideo = () => {
    Keyboard.dismiss();
    this.setState({
      paused: true
    });
    Actions.viewFullMedia({"onMakePost":true, "media":"video","videoURI":this.state.videoURI, "seekTo": 0});
  }

  _removeImage = (index) => {
    var lastImageIsBeingDeleted = false;
    var arr = this.state.imageURI;
    if(index+1 == this.state.imageURI.length){
      lastImageIsBeingDeleted = true;
    }
    arr.splice(index, 1);
    this.setState({
      imageURI: arr
    }, () => {
      if(Platform.OS == "android" && lastImageIsBeingDeleted && this.state.imageURI.length > 0){
        this.refs['mediaswiper'].scrollBy(-1,true);
      }
    })
  }

  _removeVideo = () => {
    this.setState({
      dataType: "",
      videoURI: "",
      paused: false,
      allowVideo: true,
      addedVideo: false
    })
  }

  _handlePostType = (val) => {
    this.setState({
      postTyped: val
    })
  }

  renderAddedMedia = () => {
    if(this.state.dataType === "" || this.state.dataType === "image"){
      if(this.state.imageURI.length == 0){
        return(
        <View style={{alignItems: "center", width: '100%', marginTop: 10}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => {Keyboard.dismiss(); this.selectPicture();}} style={{width: screenWidth*0.75, height: screenWidth*0.75, justifyContent: "center", alignItems: "center"}}>
            <EvilIcons size={40} name={"image"} color={"black"} />
            <TitleText size={15} text={"Add Media"} />
          </TouchableOpacity>
        </View>);
      }
      return(this.state.imageURI.map((image, index) => {
        return(
          <View>
          <View style={{alignItems: "center", width: '100%', marginTop: 10}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => this._viewFullImage(image)} style={{borderRadius: 14, borderColor: "#3e3e3e", width: screenWidth*0.75, height: screenWidth*0.75, justifyContent: "center", alignItems: "center"}}>
            <FastImage source={{uri: imageURL + image, priority: FastImage.priority.normal}} style={{backgroundColor: "gray", width: screenWidth*0.75, height: screenWidth*0.75, borderRadius: 14}} resizeMode={"cover"} ></FastImage>
          </TouchableOpacity>
          <View style={{flexDirection: "row", justifyContent: "flex-end", width: screenWidth*0.75}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._removeImage(index)}>
                <TitleText extraStyle={{paddingRight: 5}} color={"red"} size={14} text={"Delete"} />
            </TouchableOpacity>
          </View>
          </View>
          {(this.state.imageURI.length > index+1)?
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.refs['mediaswiper'].scrollBy(1, true)} style={{height: '100%', width: 40, position: "absolute", right: 0, justifyContent: "center", alignItems: "center"}}>
            <EvilIcons size={40} name={"chevron-right"} color={"black"} />
          </TouchableOpacity>:<View></View>}
          {(index - 1 >= 0)?
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.refs['mediaswiper'].scrollBy(-1, true)} style={{height: '100%', width: 40, position: "absolute", left: 0, justifyContent: "center", alignItems: "center"}}>
            <EvilIcons size={40} name={"chevron-left"} color={"black"} />
          </TouchableOpacity>:<View></View>}
          </View>
        );
      }));
    }
    else{
      return(<View></View>);
    }
    /*else{
      return(
      <TouchableOpacity activeOpacity={0.7} onPress={() => this._viewFullVideo()} style={{margin: 5, borderRadius: 20, borderWidth: 1, borderColor: "#3e3e3e", width: screenWidth/1.5, height: screenWidth/1.5, justifyContent: "center", alignItems: "center"}}>
        <Video
          repeat={true}
          muted={true}
          paused={this.state.paused}
          source={{uri: imageURL + this.state.videoURI}}
          style={{height: '100%', width: "100%", borderRadius: 19}}
          resizeMode={"cover"}
         />
         <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({paused: !this.state.paused})} style={{position: "absolute", bottom: 5, left: 5}}>
           {(this.state.paused)?<LineIcon size={30} name={"control-play"} color={"white"} />:<LineIcon size={30} name={"control-pause"} color={"white"} />}
         </TouchableOpacity>
         <TouchableOpacity activeOpacity={0.7} onPress={() => this._removeVideo()} style={{position: "absolute", top: 5, right: 5}}><LineIcon size={30} name={"close"} color={"white"} /></TouchableOpacity>
      </TouchableOpacity>
      );
    }*/
  }

  useURI = (obj) => {
    this.setState({
      showCamera: false
    });
    if(obj.isImage){
      var arr = this.state.imageURI;
      arr.push(obj.uri);
      this.setState({
        dataType: "image",
        imageURI: arr,
        allowVideo: false
      })
      if(obj.media !== undefined){
        mediaToUpload.push({
          uri: obj.media.uri,
          type: obj.media.mime,
          name: obj.media.filename || `filename1.jpg`,
        });
      }
    }
    else{
      this.setState({
        dataType: "video",
        videoURI: obj.uri,
        addedVideo: true
      })
      if(obj.media !== undefined){
        mediaToUpload.push({
          uri: obj.media.uri,
          type: obj.media.mime,
          name: obj.media.filename || `filename1.jpg`,
        });
      }
    }
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _post = async () => {
    if(this.state.uploadingImage > 0){
      alert("You still have images uploading. Please wait for them to finish.");
      return;
    }

    var textInstance = this.state.postTyped;

    if(textInstance.trim().length == 0 && this.state.imageURI.length == 0){
        return;
    }

    this.setState({
      sendingPost: true
    })
    var groupsToSend = [];
    var atleastOneGroup = false;
    groupsToSend.push(this.props.sendToGroupID);
    atleastOneGroup=true;

    if(atleastOneGroup && !tappedCreate){
      tappedCreate = true;
      var formdata = new FormData();
      formdata.append("groups", JSON.stringify(groupsToSend));
      formdata.append("media",JSON.stringify(this.state.imageURI))
      formdata.append("text", this.cleanSmartPunctuation(textInstance))
      formdata.append("allowComments", this.state.allowComments);
      formdata.append("allowSharing", false); //Change this when sharing is released
      const resp = await apiCall("/p/n", formdata);
      tappedCreate = false;
      if(resp.status == "fail"){
        if(resp.reason == "Incorrect data"){
          alert("There was a problem creating your post.");
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
      }
    }
    else{
      if(!atleastOneGroup){
        alert("You need to select a group to post in!");
      }
    }
  }

  _selectCamera = () => {
    this.RBSheet.close();
    this.setState({
      showCamera: true
    })
  }

  selectPicture = () => {
    if(this.state.imageURI.length + this.state.uploadingImage >= 25){
      alert("You must remove an image if you wish to add more.");
    }
    this.setState({
      uploadingImage: this.state.uploadingImage+1
    })
    var pass = this;
    ImagePicker.openPicker({
      mediaType: "photo",
      compressImageQuality: 0.8,
      forceJpg: true
    }).then(image => {
      this.uploadPicture({
        uri: image.path,
        type: image.mime,
        name: image.filename || `filename1.jpg`,
      });
    }).catch(e => {
      this.setState({
        uploadingImage: this.state.uploadingImage-1
      })
      alert("There was an issue with selecting this image, or you cancelled the selection.");
    });
  }

  componentWillUnmount(){
    setTimeout(function() {Actions.refresh({refresh: true})}, 500);
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
          this.setState({
            uploadingImage: this.state.uploadingImage-1
          });
          alert("There was an error with this image. Please select another.");
        }
        else{
          if(responseJson.status == "wrongdata"){
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            this.setState({
              uploadingImage: this.state.uploadingImage-1
            });
            alert("There was an error, please restart the app.");
          }
          else {
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var arr = this.state.imageURI;
            arr.push(responseJson.status);
            this.setState({
              dataType: "image",
              imageURI: arr,
              allowVideo: false,
              uploadingImage: this.state.uploadingImage-1
            });
          }
        }
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        uploadingImage: this.state.uploadingImage-1
      });
      alert("We're sorry, there seems to be an error. Please try again later.")
    });

  }

  _selectVideo = () => {
    this.RBSheet.close();
    var pass = this;
    setTimeout(function() {
      ImagePicker.openPicker({
        mediaType: "video",
      }).then(image => {
        pass.useURI({"isImage":false, "uri": image.path});
      });
    }, 500);
  }

  render() {

    return (
      //
      <Container
      sabc={"white"}
      bc={"#fafafa"}>
      <StatusBar
         barStyle={"dark-content"}  // Here is where you change the font-color
        />
          <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
            <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>New Post</Text>
            {(this.state.sendingPost == undefined)?
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._post()}  style={{position: "absolute", right: 0, height: '100%', paddingRight: 10, justifyContent: "center"}}>
              <TitleText size={16} text={"Post"} color={"#4080ff"} />
            </TouchableOpacity>
            :
            <View style={{position: "absolute", right: 0, height: '100%', paddingRight: 10, justifyContent: "center"}}>
              <ActivityIndicator size={"small"} color={"#6970ff"} />
            </View>
          }
          </View>
            <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
              <ScrollView>
                <View style={{height: 'auto', width: screenWidth, marginTop: 25}}>
                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, height: 'auto', width: screenWidth, backgroundColor: "white"}}>
                    <View>
                      <TitleText color={"#8c8c8c"} size={16} text={"Post Text"} />
                      <TextInput
                        maxLength={2048}
                        placeholder={"Say something..."}
                        style={{paddingVertical: 0, textAlignVertical: 'top', minHeight: 100, borderColor: "#cecece", paddingLeft: 5, paddingRight: 5, lineHeight: 20, fontSize: 16, fontFamily: "Raleway-Regular", width: screenWidth-20}}
                        onChangeText={(val) => this._handlePostType(val)}
                        value={this.state.postTyped}
                        multiline
                      />
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, height: 'auto', width: screenWidth, backgroundColor: "white", marginTop: 25}}>
                  <View>
                  <TitleText color={"#8c8c8c"} size={16} text={"Post Media"} />
                  {(this.state.imageURI.length > 0)?<TouchableOpacity activeOpacity={0.7} onPress={() => {Keyboard.dismiss(); this.selectPicture();}} style={{flexDirection: "row", width: screenWidth, padding: 10, backgroundColor: "white", justifyContent: "space-between"}}>
                      <View style={{flexDirection: "row", alignItems: "center", position: "absolute", right: 20}}>
                        <LineIcon name={"plus"} size={12} color={"black"} />
                        <TitleText extraStyle={{paddingLeft: 5}} size={14} text={"Add More Media"} />
                      </View>
                  </TouchableOpacity>:<View style={{height: 20}}></View>}
                  <View style={{justifyContent: "center", alignItems: "center", height: screenWidth*0.85}}>
                    <Swiper
                      removeClippedSubviews={false}
                      ref='mediaswiper'
                      loop={false}
                      index={0}
                      showsPagination={false}
                      style={{height: screenWidth*0.85}}
                      >
                        {this.renderAddedMedia()}
                      </Swiper>
                  </View>
                  {(this.state.uploadingImage > 0)?
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TitleText size={14} text={"Uploading " + this.state.uploadingImage + " image(s)..."} />
                  </View>:<View></View>}
                  </View>
                </View>
                <View style={{flexDirection: "row", height: 50, width: screenWidth, padding: 10, marginTop: 25, backgroundColor: "white", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <LineIcon name={"bubble"} size={16} color={"black"} />
                      <TitleText extraStyle={{paddingLeft: 10}} size={20} text={"Allow Comments"} />
                    </View>
                   <Switch
                      useNativeDriver={true}
                      value={this.state.allowComments}
                      onValueChange={(val) => {this.setState({allowComments: val})}}
                      backgroundActive={'#6970ff'}
                    />
                </View>
              <View style={{height: 150, width: '100%'}}></View>
              </ScrollView>
            </TouchableOpacity>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={(this.state.allowVideo)?350:250}
            >
              <View style={{paddingLeft: 10, height: 40, width: '100%', flexDirection: "row", backgroundColor: "white", justifyContent: "flex-end", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.RBSheet.close()} style={{height: '100%', width: 30, alignItems: "center", flexDirection: "row"}}>
                  <LineIcon size={20} name={"close"} color={"black"} />
                </TouchableOpacity>
              </View>
              <View style={{height: '100%', width: screenWidth, alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._selectCamera()} style={{width: screenWidth*0.85, height: 80, marginBottom: 10, marginTop: 10, borderRadius: 20, borderWidth: 1, borderColor: "purple", justifyContent: "center", alignItems: "center"}}>
                  <TitleText size={20} color={"purple"} text={"Use Camera"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.selectPicture()} style={{width: screenWidth*0.85, height: 80, marginBottom: 10, marginTop: 10, borderRadius: 20, borderWidth: 1, borderColor: "purple", justifyContent: "center", alignItems: "center"}}>
                  <TitleText size={20} color={"purple"} text={"Select Photo From Gallery"} />
                </TouchableOpacity>
                {(this.state.allowVideo)?<TouchableOpacity activeOpacity={0.7} onPress={() => this._selectVideo()} style={{width: screenWidth*0.85, height: 80, marginBottom: 10, marginTop: 10, borderRadius: 20, borderWidth: 1, borderColor: "purple", justifyContent: "center", alignItems: "center"}}>
                  <TitleText size={20} color={"purple"} text={"Select Video From Gallery"} />
                </TouchableOpacity>:<View></View>}
              </View>
            </RBSheet>
      </Container>
   );
 }
}

export default MakePost;
