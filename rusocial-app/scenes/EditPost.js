import React, {Component} from 'react';
import { StatusBar, Keyboard, TextInput, Image, TouchableOpacity, Dimensions, ScrollView, View, Text } from 'react-native';

import { Actions } from 'react-native-router-flux';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import Dialog from "react-native-dialog";
import Swiper from 'react-native-swiper';
import { Switch } from 'react-native-switch';
import FastImage from 'react-native-fast-image'

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';
import CheckButton from '../elements/CheckButton';
import GroupListItem from '../components/GroupListItem';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

import global from '../utilities/global';
import { apiCall, imageURL } from '../utilities/Connector';
import cache from '../in_memory_cache.js';

let tappedCreate = false;
let tappedDelete = false;

var mediaToUpload = [];

var friendsToAdd = {};
class Group extends Component {

  sentImages = {};

  originalHadMedia = (this.props.postType == 2)?true:(this.props.postType == 1)?true:false;
  mediaSize = this.props.media.length;
  effectiveMediaSize = this.props.media.length;

  originalText = this.props.text;
  newText = this.props.text;

  originalAllowComments = this.props.allowComments;
  originalAllowSharing = this.props.allowSharing

  state = {
    showCamera: false,
    showCameraPreview: false,
    addedVideo: false,
    allowVideo: true,
    paused: false,
    imageURI: (this.props.postType == 1)?this.props.media:[],
    dataType: (this.props.postType == 2)?"video":(this.props.postType == 1)?"image":"",
    videoURI: (this.props.postType == 2)?this.props.media[0]:"",
    postTyped: this.props.text,
    deleteConfirmDialog: false,
    allowSharing: this.props.allowSharing,
    allowComments: this.props.allowComments,
    requiresSave: false,
    removedImages: {}
  }

  componentDidMount = () => {
  }

  componentWillUnmount(){
    setTimeout(function() {Actions.refresh({refresh: true})}, 500);
  }

  _viewFullImage = (image) => {
    if(this.state.removedImages[image]){

    }
    else{
      Keyboard.dismiss();
      Actions.viewFullMedia({"onMakePost":true, "imageURI": imageURL + image})
    }
  }

  _removeImage = (image) => {
    var obj = this.state.removedImages;
    obj[image] = (obj[image] == undefined)?true:!obj[image];
    if(obj[image]){
      this.effectiveMediaSize--;
    }
    else{
      this.effectiveMediaSize++;
    }
    this.setState({
      removedImages: obj,
      requiresSave: (this.newText != this.originalText || this.originalAllowComments != this.state.allowComments || this.originalAllowSharing != this.state.allowSharing || this.effectiveMediaSize != this.mediaSize)

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
    this.newText = val;
    this.setState({
      postTyped: val,
      requiresSave: (this.newText != this.originalText || this.originalAllowComments != this.state.allowComments || this.originalAllowSharing != this.state.allowSharing || this.effectiveMediaSize != this.mediaSize)
    })
  }

  renderAddedMedia = () => {
    if(this.state.dataType === "" || this.state.dataType === "image"){
      return(this.state.imageURI.map((image, index) => {
        return(
          <View>
          <View style={{alignItems: "center", width: '100%', marginTop: 10}}>
          <TouchableOpacity activeOpacity={(this.state.removedImages[image])?1:0.7} onPress={() => this._viewFullImage(image)} style={{borderRadius: 14, borderColor: "#3e3e3e", width: screenWidth*0.75, height: screenWidth*0.75, justifyContent: "center", alignItems: "center"}}>
            <FastImage source={{uri: imageURL + image, priority: FastImage.priority.normal}} style={{backgroundColor: "gray", width: screenWidth*0.75, height: screenWidth*0.75, borderRadius: 14}} resizeMode={"cover"} ></FastImage>
            {(this.state.removedImages[image])?
              <View style={{position: "absolute", width: screenWidth*0.75, height: screenWidth*0.75, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center"}}>
                <TitleText color={"white"} size={20} text={"Deleted"} />
              </View>
              :
              <View></View>}
          </TouchableOpacity>
          <View style={{flexDirection: "row", justifyContent: "flex-end", width: screenWidth*0.75}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._removeImage(image)}>
              {(this.state.removedImages[image])?
                <TitleText extraStyle={{paddingRight: 5}} color={"#3e3e3e"} size={14} text={"Undo"} />
                :
                <TitleText extraStyle={{paddingRight: 5}} color={"red"} size={14} text={"Delete"} />
              }
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

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _confirmDelete = () => {
    this.setState({
      deleteConfirmDialog: true
    })
  }

  _cancelDelete = () => {
    this.setState({
      deleteConfirmDialog: false
    })
  }

  onEnter = async () => {
    var formdata = new FormData();
    formdata.append("postid", this.props.postid);
    const getPostCall = await apiCall("/p/gp",formdata);
    var gpcParsed = JSON.parse(getPostCall.data);
    if(gpcParsed == null){
      return;
    }
    this.setState({
      postTyped: gpcParsed.text,
      allowSharing: gpcParsed.allowSharing,
      allowComments: gpcParsed.allowComments,
      imageURI: (gpcParsed.type == 1)?gpcParsed.media:[],
      dataType: (gpcParsed.type == 2)?"video":(gpcParsed.type == 1)?"image":"",
      videoURI: (gpcParsed.type == 2)?gpcParsed.media[0]:"",
    });
    this.originalText = gpcParsed.text;
    this.newText = gpcParsed.text;
    mediaToUpload = gpcParsed.media;
    if(cache.in_memory_cache == undefined){
      cache.in_memory_cache = {};
    }
    if(cache.in_memory_cache.posts == undefined){
      cache.in_memory_cache.posts = {};
    }
    cache.in_memory_cache.posts[this.props.id] = gpcParsed;
  }

  _delete = async () => {
    this.setState({
      deleteConfirmDialog: false
    })
    if(!tappedDelete){
      tappedDelete = true;
      var formdata = new FormData();
      formdata.append("postid", this.props.postid);
      const resp = await apiCall("/p/d", formdata);
      tappedDelete = false;
      if(resp.status == "fail"){
        if(resp.reason == "Incorrect data"){
          alert("There was a problem deleting your post.");
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
  }

  _save = async () => {
    if(!tappedCreate && this.state.requiresSave){
      tappedCreate = true;

      var mediaToSend = this.state.imageURI;

      for(var i = 0; i<mediaToSend.length; i++){
        if(this.state.removedImages[mediaToSend[i]]){
          mediaToSend.splice(i, 1);
        }
      }


      var textInstance = this.cleanSmartPunctuation(this.newText);
      var formdata = new FormData();
      formdata.append("mediaRemoved", (this.state.dataType == "" && this.originalHadMedia)?true:false);
      formdata.append("media", JSON.stringify(mediaToSend));
      formdata.append("text", textInstance);
      formdata.append("postid", this.props.postid);
      formdata.append("allowSharing", this.state.allowSharing);
      formdata.append("allowComments", this.state.allowComments);
      formdata.append("mediaSizeChanged", !(this.mediaSize == mediaToUpload.length))
      const resp = await apiCall("/p/e", formdata);
      tappedCreate = false;
      if(resp.status == "fail"){
        if(resp.reason == "Incorrect data"){
          alert("There was a problem editing your post.");
        }
        else if(resp.reason == "Token failed"){
          Actions.replace("login");
        }
        else{
          alert("There was a problem with the server. Please try again later.");
        }
      }
      else if(resp.status == "success"){
        try{
          this.props.postRef.setState({
            text: textInstance,
            allowComments: this.state.allowComments,
            allowSharing: this.state.allowSharing,
            media: mediaToSend
          })
        }
        catch(e){
          console.log(e);
        }
        if(this.props.pass != undefined){
          try{
            var post = this.props.pass.state.post;
            post.allowComments = this.state.allowComments;
            post.allowSharing = this.state.allowSharing;
            post.text = textInstance;
            post.media = mediaToSend;
            this.props.pass.setState({
              post: post
            });
          }
          catch(e){
            console.log(e);
          }
        }

        Actions.pop();
      }
    }
  }

  render() {

    return (
      //
      <Container
      sabc={"white"}
      bc={"#fafafa"}
      >
      <StatusBar
         barStyle={"dark-content"}  // Here is where you change the font-color
        />
              <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
                <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Manage Post</Text>
                <TouchableOpacity activeOpacity={(this.state.requiresSave)?0.7:1} onPress={() => this._save()}  style={{position: "absolute", right: 0, marginRight: 10, padding: 5, borderRadius: 10, justifyContent: "center", backgroundColor: (this.state.requiresSave)?"#3CB371":"#dedede"}}>
                  <TitleText size={16} color={(this.state.requiresSave)?"white":"#aeaeae"} text={"Save"} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} style={{height: screenHeight-60}}>
            <View style={{minHeight: 'auto', width: screenWidth, marginTop: 25}}>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, height: 'auto', width: screenWidth, backgroundColor: "white"}}>
                <View>
                  <TitleText color={"#8c8c8c"} size={16} text={"Post Text"} />
                  <TextInput
                    placeholder={"Say something..."}
                    maxLength={2048}
                    style={{paddingVertical: 0, textAlignVertical: 'top', minHeight: 100, borderColor: "#cecece", paddingLeft: 5, paddingRight: 5, lineHeight: 20, fontSize: 16, fontFamily: "Raleway-Regular", width: screenWidth-20}}
                    onChangeText={(val) => this._handlePostType(val)}
                    value={this.state.postTyped}
                    multiline
                  />
                </View>
              </View>
            </View>
            {(this.state.dataType !== "" && this.state.imageURI.length > 0)?
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, height: 'auto', width: screenWidth, backgroundColor: "white", marginTop: 25}}>
              <View>
              <TitleText color={"#8c8c8c"} size={16} text={"Post Media"} />
                {(this.state.dataType !== "")?
                <View>
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
                </View>:<View></View>}
              </View>
            </View>:<View></View>}

            <View style={{flexDirection: "row", height: 50, width: screenWidth, padding: 10, marginTop: 25, backgroundColor: "white", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <LineIcon name={"bubble"} size={16} color={"black"} />
                  <TitleText extraStyle={{paddingLeft: 10}} size={20} text={"Allow Comments"} />
                </View>
               <Switch
                  useNativeDriver={true}
                  value={this.state.allowComments}
                  onValueChange={(val) => this.setState({allowComments: val, requiresSave: (this.newText != this.originalText || this.originalAllowComments != val || this.originalAllowSharing != this.state.allowSharing || this.effectiveMediaSize != this.mediaSize)})}
                  backgroundActive={'#6970ff'}
                />
            </View>
            {(false)?
            <View style={{flexDirection: "row", height: 50, width: screenWidth, padding: 10, backgroundColor: "white", justifyContent: "space-between"}}>
              <View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <LineIcon name={"share"} size={16} color={"black"} />
                  <TitleText extraStyle={{paddingLeft: 10}} size={20} text={"Allow Shares"} />
                </View>
              </View>
               <Switch
                  useNativeDriver={true}
                  value={this.state.allowSharing}
                  onValueChange={(val) => this.setState({allowSharing: val, requiresSave: (this.newText != this.originalText || this.originalAllowComments != this.state.allowComments || this.originalAllowSharing != val || effectiveMediaSize != this.mediaSize)})}
                  backgroundActive={'#6970ff'}
                />
            </View>:<View></View>}


            {(false)?
            <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.postReach({"postid":this.props.postid})} style={{marginTop: 25, backgroundColor: "white", height: 50, width: '100%', justifyContent: "space-between", alignItems: "center", padding: 5, flexDirection: "row"}}>
              <View style={{paddingLeft: 5, flexDirection: "row", alignItems: "center"}}>
                <LineIcon name={"chart"} size={16} color={"black"} />
                <TitleText extraStyle={{paddingLeft: 10}} size={20} text={"Post Reach"} />
              </View>
              <EvilIcons name={"chevron-right"} size={40} color={"#000"} />
            </TouchableOpacity>
            :
            <View></View>}

            <View style={{width: '100%', flexDirection: "row", justifyContent: "flex-end", marginTop: 25, paddingRight: 10, marginBottom: 50}}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this._confirmDelete()} style={{height: 35, width: 150, borderWidth: 2, backgroundColor: "white", borderColor: "red", borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <LineIcon name={"trash"} size={16} color={"red"} />
                <TitleText extraStyle={{marginLeft: 5}} color={"red"} size={14} text={"Delete Post"} />
              </TouchableOpacity>
            </View>

          </ScrollView>
            <Dialog.Container visible={this.state.deleteConfirmDialog}>
            <Dialog.Title>Delete Post?</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this post?
            </Dialog.Description>
            <Dialog.Button onPress={() => this._cancelDelete()} label="Cancel" />
            <Dialog.Button onPress={() => this._delete()} label="Delete" />
            </Dialog.Container>
      </Container>
   );
 }
}

export default Group;
