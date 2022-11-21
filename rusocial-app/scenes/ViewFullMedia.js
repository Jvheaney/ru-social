import React, {Component} from 'react';
import { StatusBar, Linking, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, View, Text } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
//import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from "react-native-raw-bottom-sheet";

import LowerPostMenu from '../components/LowerPostMenu';
import ShareMenu from '../components/ShareMenu';

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';
import FastImage from 'react-native-fast-image'

import { imageURL } from '../utilities/Connector';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

let lastPress = 0;
let lastDir = '';
let playerIsLoaded = false;
class ViewFullMedia extends Component {

  state = {
    paused: false,
    muted: false,
    showControls: true,
    lastTap: Math.round((new Date()).getTime() / 1000),
    currentTime: (!this.props.seekToTime)?0:this.props.seekToTime,
    seekedBack: false,
    seekedForward: false,
    bottomType: "share",
    shareType: "chat",
    postid: this.props.postid,
  }

  _openBottomMenu = (obj) => {
    this.setState({
      bottomType: "share",
      postid: this.props.postid
    });
    this.RBSheet.open();
  }

  _openShareSheet = (obj) => {
    this.RBSheet.close();
    this.setState({
      shareType: "share",
      postid: this.props.postid
    },function() {
      var pass = this;
      setTimeout(function() {
        pass.ShareSheet.open();
      }, 500);
    });
  }

  _handleVideoClick = () => {
    var pass = this;
    this.setState({
      showControls: !this.state.showControls,
      lastTap: Math.round((new Date()).getTime() / 1000)
    },function() {
      setTimeout(function() {
        if(pass.state.showControls && (Math.round((new Date()).getTime() / 1000) - pass.state.lastTap) >= 3){
          pass.setState({
            showControls: false
          });
        }
      },3100)
    });
  }

  onDoublePress = (pos) => {
      const time = new Date().getTime();
      const delta = time - lastPress;

      const DOUBLE_PRESS_DELAY = 300;
      if (delta < DOUBLE_PRESS_DELAY && pos === lastDir && playerIsLoaded) {
          var curTime = parseInt(this.state.currentTime);
          if(pos === 'back'){
            this.refs['fullvideoplayer'].seek(curTime - 5);
            var pass = this;
            this.setState({
              seekedBack: true
            }, function(){
              setTimeout(function() {
                pass.setState({
                  seekedBack: false
                })
              }, 500);
            });
          }
          else{
            this.refs['fullvideoplayer'].seek(curTime + 5);
            var pass = this;
            this.setState({
              seekedForward: true
            }, function(){
              setTimeout(function() {
                pass.setState({
                  seekedForward: false
                })
              }, 500);
            });
          }
      }
      var pass2 = this;
      setTimeout(function() {
        if((new Date().getTime() - lastPress) > 300 && !pass2.state.seekedBack && !pass2.state.seekedForward){
          pass2._handleVideoClick();
        }
      }, 320)
      lastDir = pos;
      lastPress = time;
  };

  render() {

    return (
      //
      <Container bc="black">
      <StatusBar
         barStyle={"light-content"}  // Here is where you change the font-color
        />
          <View>
            <View style={{height: screenHeight-20}}>
              {(this.props.media === 'video')?
                <View></View>
                :
                <View>
                <View style={{paddingLeft: 10, height: 40, width: '100%', justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.pop()} style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
                    <EvilIcons name="chevron-left" size={40} color={"white"} />
                  </TouchableOpacity>
                  {(!this.props.onMakePost)?<TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(imageURL + this.props.imageURI)} style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
                    <Icon name="external-link-alt" size={16} color={"white"} />
                  </TouchableOpacity>:<View></View>}
                </View>
                <View style={{height: screenHeight-150, width: '100%', justifyContent: "center", alignItems: "center"}}>
                  <FastImage
                    source={{uri: imageURL + this.props.imageURI, priority: FastImage.priority.normal}}
                    style={{height: '100%', width: '100%'}}
                    resizeMode={"contain"}
                  ></FastImage>
                  </View>
                </View>
              }
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
          </View>
      </Container>
   );
 }
}

export default ViewFullMedia;
