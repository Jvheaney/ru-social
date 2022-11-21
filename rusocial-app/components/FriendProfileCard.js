import React, {Component} from 'react';
import { Clipboard, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import ProfileBadge from './ProfileBadge';
import badges from '../badges.js';
import LinearGradient from 'react-native-linear-gradient';
import InterestBubble from '../components/InterestBubble';
import ClassBubble from '../components/ClassBubble';
import SpotifyBubble from '../components/SpotifyBubble';
import GLOBAL from '../global.js'
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import RBSheet from "react-native-raw-bottom-sheet";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import FastImage from 'react-native-fast-image'

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
screenHeight = Platform.select({
  ios: screenHeight,
  android:
    StatusBar.currentHeight > 24
      ? screenHeight
      : screenHeight - StatusBar.currentHeight,
});

let gotArtistData = false;
var allowReportClick = true;
var allowBlockClick = true;

let spotifyCalled = false;
let reportCalled = false;
let blockCalled = false;
let addFriendCalled = false;
let removeFriendCalled = false;
let friendAcceptedCalled = false;
let slideCalled = false;
let showCopiedChanged = false;

const feedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

class Swipe extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.preview && (nextProps.bio !== this.props.bio || nextProps.firstname_display !== this.props.firstname_display || nextProps.birthdate !== this.props.birthdate
     || nextProps.classes !== this.props.classes || nextProps.pronouns !== this.props.pronouns || nextProps.year !== this.props.year || nextProps.program !== this.props.program
   || nextProps.top_5_spotify !== this.props.top_5_spotify || nextProps.badges !== this.props.badges || nextProps.interests !== this.props.interests || nextProps.images[0] !== this.props.images[0])){
      return true;
    }
    if(Platform.OS == "android" && (nextProps.topNotch != this.props.topNotch || nextProps.bottomNotch != this.props.bottomNotch || nextProps.bottomBarIsOpen != this.props.bottomBarIsOpen)){
      this.setState({
        topNotch: nextProps.topNotch,
        bottomNotch: nextProps.bottomNotch,
        bottomBarIsOpen: nextProps.bottomBarIsOpen
      })
      var debug = {
        "topNotch": nextProps.topNotch,
        "bottomNotch": nextProps.bottomNotch,
        "bottomBarIsOpen": nextProps.bottomBarIsOpen
      }
      return true;
    }
    if(spotifyCalled){
      spotifyCalled = false;
      return true;
    }
    else if(reportCalled){
      reportCalled = false;
      return true;
    }
    else if(blockCalled){
      blockCalled = false;
      return true;
    }
    else if(addFriendCalled){
      addFriendCalled = false;
      return true;
    }
    else if(removeFriendCalled){
      removeFriendCalled = false;
      return true;
    }
    else if(friendAcceptedCalled){
      friendAcceptedCalled = false;
      return true;
    }
    else if(slideCalled){
      slideCalled = false;
      return true;
    }
    else if(showCopiedChanged){
      showCopiedChanged = false;
      return true;
    }
    return false;
  }


  componentDidMount() {
    var debug = {
      "topNotch": this.props.topNotch,
      "bottomNotch": this.props.bottomNotch,
      "bottomBarIsOpen": this.props.bottomBarIsOpen
    }
  }

  renderBadges = (badges_passed) => {
    var data = JSON.parse(badges_passed);
    var badges_to_render = [];
    for (var i = 0; i<data.length; i++) {
      badges_to_render.push(
          <ProfileBadge friends type={data[i]} />
      );
    }
    return(badges_to_render);
  }

  reportDialog = (userid, username) => {
    this.RBSheet.close();
    setTimeout(() => {
      reportCalled = true;
      this.setState({
        reportUserDialog: true,
        report_userid: userid,
        report_username: username
      })
    }, 500)

  }

  _cancelReport = () => {
    reportCalled = true;
    this.setState({
      reportUserDialog: false
    })
  }

  _report = () => {
    if(allowReportClick && this.state.reportUserMessage != ""){
      allowReportClick = false;
      var details = {
        "token": GLOBAL.authToken,
        "reported_userid": this.props.userid,
        "message": this.cleanSmartPunctuation(this.state.reportUserMessage)
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/r/u', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            allowReportClick = true;
            Actions.replace("login");
          }
          else if(responseJson.status == "wrongdata"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowReportClick = true;
            alert("There was an error submitting your report.");
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            reportCalled = true;
            this.setState({
              reportUserDialog: false,
            })
            var pass = this;
            reportCalled = true;
            setTimeout(() => {
              reportCalled = true;
              this.setState({
                reportUserDialogSubmitted: true
              });
              allowReportClick = true;
            }, 500);
          }
        })
      .catch((error) => {
        allowReportClick = true;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  blockUser = () => {
    if(allowBlockClick){
      allowBlockClick = false;
      var details = {
        "token": GLOBAL.authToken,
        "userid": this.props.userid,
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/ft/bu', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            Actions.replace("login");
          }
          else if(responseJson.status == "wrongdata"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowBlockClick = true;
            alert("There was an error blocking this user.");
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            allowBlockClick = true;
          }
        })
      .catch((error) => {
        allowBlockClick = true;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
  }

  _handleReportText = (message) => {
    this.setState({
      reportUserMessage: message
    })
  }

  renderArtists = (artist_ids) => {
    var artistBubbles = [];
    if(this.state.temp_spotifyData.length > 0){
      for(var i = 0; i<this.state.temp_spotifyData.length; i++){
        artistBubbles.push(<SpotifyBubble key={this.state.temp_spotifyData[i].artist_id} name={this.state.temp_spotifyData[i].artist_name} image={this.state.temp_spotifyData[i].artist_image} />);
      }
      return artistBubbles;
    }
    else{
      var data = JSON.parse(artist_ids);
      if(!gotArtistData){
        const artist_data = this.getArtists(JSON.parse(artist_ids));
      }

      return(<View></View>);
    }

  }

  toggleFriendRequest = (userid) => {
    if(this.state.alreadyAdded){
      return;
    }
    else if(this.state.requestSent){
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
      this.cancelRequest(userid);
    }
    else{
      ReactNativeHapticFeedback.trigger("impactMedium", feedbackOptions);
      this.sendFriendRequest(userid);
    }
  }

  cancelRequest = (userid) => {
    removeFriendCalled = true;
    this.setState({
      requestSent: false
    });
    var pass = this;
    var details = {
      "token": GLOBAL.authToken,
      "userid": userid
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/ft/rsr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          removeFriendCalled = true;
          this.setState({
            requestSent: true
          });
          alert("There was an error canceling your friend request. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA" && responseJson.error == null){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
        }
    })
    .catch((error) => {
      removeFriendCalled = true;
      this.setState({
        requestSent: true
      });
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  sendFriendRequest = (userid) => {
    addFriendCalled = true;
    this.setState({
      requestSent: true
    });
    var pass = this;
    var details = {
      "token": GLOBAL.authToken,
      "userid": userid
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/ft/sfr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          addFriendCalled = true;
          this.setState({
            requestSent: false
          });
          alert("There was an error sending your friend request. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA" && responseJson.error == null){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          if(responseJson.status == "added"){
            addFriendCalled = true;
            this.setState({
              showFriendAdded: true,
              alreadyAdded: true
            })
          }
        }
    })
    .catch((error) => {
      addFriendCalled = true;
      this.setState({
        requestSent: false
      });
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  getArtists = (data) => {
    var details = {
        "artist_1": data[0],
        "artist_2": data[1],
        "artist_3": data[2],
        "artist_4": data[3],
        "artist_5": data[4]
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/gsa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        spotifyCalled = true;
        if(Array.isArray(responseJson.artist_data)){
          this.setState({
            spotifyLoading: false,
            temp_spotifyData: responseJson.artist_data
          })
        }
        else{
          this.setState({
            spotifyLoading: false
          })
        }
    })
    .catch((error) => {
      //alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  renderBadgesFull = (badges_passed) => {
    var data = JSON.parse(badges_passed);
    var badges_to_render = [];
    for (var i = 0; i<data.length; i++) {
      badges_to_render.push(
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
          <ProfileBadge friends type={data[i]} />
          <Text style={{marginLeft: 10, fontSize: 20, color: "black", fontFamily: "Raleway-Medium"}}>{badges[data[i]].badge_name}</Text>
        </View>
      );
    }
    return(badges_to_render);
  }

  renderInterests = (interests) => {
    var data = JSON.parse(interests);
    var interests_to_return = [];
    for (var i = 0; i<data.length; i++) {
      interests_to_return.push(<InterestBubble friends disabled func={this.removeInterest} key={data[i]} interest={this.capitalizeFirstLetter(data[i])} />);
    }
    return (interests_to_return);
  }

  renderClasses = (classcode) => {
    var data = JSON.parse(classcode);
    var interests_to_return = [];
    for (var i = 0; i<data.length; i++) {
      interests_to_return.push(<ClassBubble common={(GLOBAL.friends == undefined || GLOBAL.friends.classes == undefined)?false:GLOBAL.friends.classes.includes('"' + data[i] + '"')} friends disabled func={this.removeInterest} key={data[i]} classcode={data[i]} />);
    }
    return (interests_to_return);
  }

  _renderItem = ({item, index}) => {
        return (
          <View style={{height: screenWidth*1.3, width: screenWidth, justifyContent: "center", alignItems: "center", padding: screenWidth*0.025}}>
              <FastImage
                source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + item, priority: FastImage.priority.normal}}
                style={{height: screenWidth*1.25, width: screenWidth*0.75, backgroundColor: "gray", borderRadius: 20, resizeMode: "cover", overflow: "hidden"}}>
              </FastImage>
          </View>
        );
    }

    get pagination () {
        const { activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={this.props.images.length}
              activeDotIndex={activeSlide}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.92)'
              }}
              inactiveDotStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  state = {
    shareurl: (GLOBAL.shareurl)?GLOBAL.shareurl:"",
    topNotch: this.props.topNotch,
    bottomNotch: this.props.bottomNotch,
    bottomBarIsOpen: this.props.bottomBarIsOpen,
    showCopied: false,
    activeSlide: 0,
    temp_spotifyData: [],
    requestSent: this.props.requestSent,
    report_userid: "",
    report_username: "",
    reportUserDialog: false,
    reportUserMessage: "",
    reportUserDialogSubmitted: false,
    alreadyAdded: false,
    showFriendAdded: false
  }

  _copyProfileURL = () => {
    Clipboard.setString(this.state.shareurl + this.props.userid);
    showCopiedChanged = true;
    this.setState({
      showCopied: true
    });
    var pass = this;
    setTimeout(function() {
      showCopiedChanged = true;
      pass.setState({
        showCopied: false
      })
    }, 2000);
  }

  dictateSizing = (forNavbar) => {
    if(Platform.OS == "android" && (this.props.bottomNotch == 0)){
      if(forNavbar){
        return 55;
      }
      else{
        return screenHeight;
        //return (screenHeight-55)+24;
      }
    }
    else if(Platform.OS == "android"){
      if(forNavbar){
        return 55;
      }
      else{
        return screenHeight;
        //return (screenHeight-(55+this.props.bottomNotch))+24;
      }
    }
    else if(this.props.bottomNotch == 0){
      if(forNavbar){
        return 55;
      }
      else{
        return screenHeight-55;
      }
    }
    else{
      if(forNavbar){
        return 75;
      }
      else{
        return screenHeight-75
      }
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{height: this.dictateSizing(false), backgroundColor: "white"}}>
        <FastImage
          source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.props.images[0], priority: FastImage.priority.normal}}
          style={{flex: 1,
            resizeMode: "cover",
            backgroundColor: "white"
          }}
         >
         <LinearGradient colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.5)', 'transparent']} style={{position: "absolute", top: 0, width: screenWidth, paddingTop: (this.props.preview || Platform.OS == "android")?0:this.state.topNotch, paddingBottom: 25}}>
           <Text numberOfLines={1} style={{fontSize: 25, paddingLeft: 15, paddingTop: 5, color: "white", fontFamily: "Raleway-Bold", maxWidth: '80%'}}>{this.props.firstname_display}</Text>
           <Text numberOfLines={1} style={{fontSize: 15, paddingLeft: 15, paddingTop: 2, color: "white", fontFamily: "Raleway-Medium", maxWidth: '80%'}}>{this.props.pronouns}, {this.props.year}</Text>
           <Text style={{fontSize: 15, paddingLeft: 15, paddingTop: 2, color: "white", fontFamily: "Raleway-Medium"}}>{this.props.program}</Text>
        </LinearGradient>
        <View style={{position: "absolute", bottom: 0}}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0.8)']} style={{width: screenWidth}}>
        {(GLOBAL.friends.algo_pref == 0 && this.props.classes)?
          <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
            { (this.props.classes && this.props.classes.length > 2) ? this.renderClasses(this.props.classes) : null }
          </ScrollView>
          :
          <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
            { (this.props.interests && this.props.interests.length > 2) ? this.renderInterests(this.props.interests) : null }
          </ScrollView>}
          <View style={{paddingBottom: (Platform.OS == "android")?70:15, maxHeight: screenHeight*0.3}}>
            <Text numberOfLines={3} style={{fontSize: 16, padding: 10, color: "white", fontFamily: "Raleway-Medium",}}>
              {this.props.bio}
            </Text>
            <View style={{height: 'auto', width: '100%', justifyContent: "center", alignItems: "center", paddingBottom: (this.props.preview)?40:0}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.RBSheet.open()}} style={{height: 50, paddingLeft: 10, paddingRight: 10, width: 'auto', backgroundColor: "#5bb8ff", borderRadius: 50, justifyContent: "center", alignItems: "center"}}>
              <Text numberOfLines={1} style={{fontSize: 16, padding: 10, color: "white", fontFamily: "Raleway-Bold", maxWidth: '80%'}}>
                See more about {this.props.firstname_display}
              </Text>
            </TouchableOpacity>
            </View>
          </View>
       </LinearGradient>
       </View>
           <View style={{elevation: 99999, position: "absolute", top: (this.props.preview || Platform.OS == "android")?0:this.state.topNotch, right: 5, height: 80, width: 'auto', justifyContent: "space-between", flexDirection: "row"}}>
             {
               (this.props.badges && this.props.badges.length > 2)?
               <View>{this.renderBadges(this.props.badges)}</View>
               :<View></View>
             }
           </View>
           <View style={{elevation: 99999, position: "absolute", bottom: screenHeight*0.345, right: 5, height: 'auto', width: 'auto', justifyContent: "space-between", alignItems: "center", flexDirection: "column"}}>
           {(!this.props.preview || (this.props.allowFriending && !this.props.isFriend && !this.props.isMe))?
             <TouchableOpacity activeOpacity={0.7} onPress={() => this.toggleFriendRequest(this.props.userid)} style={{height: 75, width: 75, backgroundColor: (this.state.alreadyAdded)?"#62d162":(this.state.requestSent)?"#ff5b5b":"#5bb8ff", borderRadius: 40, justifyContent: "center", alignItems: "center",  shadowColor: '#000',
             shadowOffset: { width: 2, height: 3 },
             shadowOpacity: 0.2,
             shadowRadius: 5,
             elevation: 2}}>
              {(this.state.alreadyAdded)?<LineIcon name="user-following" size={30} color="white" />:(this.state.requestSent)?<LineIcon name="user-unfollow" size={30} color="white" />:<LineIcon name="user-follow" size={30} color="white" />}
            </TouchableOpacity>:<View></View>}
            {(this.props.allowReport)?
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.reportDialog(this.props.userid, this.props.firstname_display)} style={{zIndex: 99999, marginTop: 10, backgroundColor: "rgba(255,255,255,1)", height: 28, width: 27, borderRadius: 40, justifyContent: "center", alignItems: "center",  shadowColor: '#000',
            shadowOffset: { width: 2, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 99999}}>
             <LineIcon name="exclamation" size={28} color="#ff5b5b" />
           </TouchableOpacity>:<View></View>}
         </View>
        </FastImage>
        <RBSheet
          onOpen={() => {slideCalled = true; this.setState({activeSlide: 0})}}
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={screenHeight*0.90}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: "#000000"
            },
            container: {
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20
            }
          }}
        >
        <View style={{flex: 1}}>
          <View style={{height: 50, width: '100%', justifyContent: "space-between", flexDirection: "row", alignItems: "center"}}>
          {(!this.props.preview || (this.props.allowFriending && !this.props.isFriend && !this.props.isMe))?(!this.state.alreadyAdded)?
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.toggleFriendRequest(this.props.userid)} style={{height: 50, width: 'auto', justifyContent: "center"}}>
            {(this.state.requestSent)?
              <Text style={{paddingLeft: 20, fontSize: 18, color: "#ff5b5b", fontFamily: "Raleway-Bold"}}>Unadd</Text>
              :
              <Text style={{paddingLeft: 20, fontSize: 18, color: "#5bb8ff", fontFamily: "Raleway-Bold"}}>Add</Text>
            }
            </TouchableOpacity>:<View style={{height: 50, width: 'auto', justifyContent: "center"}}><Text style={{paddingLeft: 20, fontSize: 18, color: "#62d162", fontFamily: "Raleway-Bold"}}>Added</Text></View>:<View style={{height: 50, width: 50, justifyContent: "center"}}></View>}
            <Text numberOfLines={1} style={{fontSize: 18, color: "black", fontFamily: "Raleway-Bold", maxWidth: '50%'}}>{this.props.firstname_display}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.RBSheet.close()} style={{height: 50, width: 'auto', justifyContent: "center"}}><Text style={{paddingRight: 20, fontSize: 18, color: "gray", fontFamily: "Raleway-Medium"}}>Close</Text></TouchableOpacity>
          </View>
          <ScrollView>
            <View>
              <Text numberOfLines={1} style={{fontSize: 35, paddingLeft: 15, paddingTop: 5, color: "black", fontFamily: "Raleway-Bold", maxWidth: '80%'}}>{this.props.firstname_display}</Text>
              <Text numberOfLines={1} style={{fontSize: 15, paddingLeft: 15, paddingTop: 2, color: "black", fontFamily: "Raleway-Medium", maxWidth: '80%'}}>{this.props.pronouns}, {this.props.year}</Text>
              <Text style={{fontSize: 15, paddingLeft: 15, paddingTop: 2, color: "black", fontFamily: "Raleway-Medium"}}>{this.props.program}</Text>
            </View>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.images}
              renderItem={this._renderItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              onSnapToItem={(index) => {slideCalled = true; this.setState({ activeSlide: index })} }
            />
            { this.pagination }
            {(this.props.bio && this.props.bio.length > 0)?
            <View>
              <Text style={{fontSize: 20, paddingLeft: 15, paddingTop: 5, color: "black", fontFamily: "Raleway-Bold"}}>About Me</Text>
              <Text style={{fontSize: 18, paddingLeft: 15, paddingRight: 15, paddingTop: 5, color: "black", fontFamily: "Raleway-Medium"}}>
                {this.props.bio}
              </Text>
            </View>
            :<View></View>}
            {(this.props.interests && this.props.interests.length > 2)?
            <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
              <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Interests</Text>
              <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                {this.renderInterests(this.props.interests)}
              </View>
            </View>
           :
           <View></View>
           }
           {(this.props.classes && this.props.classes.length > 2)?
           <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
             <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Classes</Text>
             <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
               {this.renderClasses(this.props.classes)}
             </View>
           </View>
          :
          <View></View>
          }
          {(this.props.badges && this.props.badges.length > 2)?
            <View style={{width: screenWidth, justifyContent: "center", alignItems: "center", paddingTop: 10}}>
            <View style={{height: 'auto', width: 200, marginTop: 10, marginBottom: 10, justifyContent: "center"}}>
              {this.renderBadgesFull(this.props.badges)}
            </View>
           </View>
          :<View></View>}
           {(this.props.top_5_spotify && this.props.top_5_spotify.length > 4)?
           <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
             <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Top 5 Spotify Artists</Text>
             <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
               {this.renderArtists(this.props.top_5_spotify)}
               {(this.state.spotifyLoading)?
                <View><Text>LOADING</Text></View>:<View></View>}
             </View>
           </View>
          :
          <View></View>
          }
          {(this.state.shareurl != "" && this.state.shareurl != undefined)?
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this._copyProfileURL()}
              style={{marginTop: 40, flexDirection: "row", height: 50, width: screenWidth, justifyContent: "center", alignItems: "center"}}>
              <LineIcon style={{marginRight: 5}} name="link" size={20} color="blue" />
              <Text numberOfLines={1} style={{fontSize: 20, fontFamily: "Raleway-Medium", color: "blue", maxWidth: '60%'}}>Share {this.props.firstname_display}'s profile</Text>
            </TouchableOpacity>
            <View style={{height: 25, width: '100%', alignItems: "center"}}>
              {(this.state.showCopied)?
                <Text style={{fontSize: 14, color: "green", fontFamily: "Raleway-Regular"}}>Link copied to clipboard.</Text>
                :<View></View>}
            </View>
          </View>:<View></View>}
          {(!this.props.preview || this.props.allowReport)?
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.reportDialog(this.props.userid, this.props.firstname_display)}
            style={{marginTop: 40, flexDirection: "row", height: 50, width: screenWidth, justifyContent: "center", alignItems: "center"}}>
            <LineIcon style={{marginRight: 5}} name="exclamation" size={20} color="red" />
            <Text numberOfLines={1} style={{fontSize: 20, fontFamily: "Raleway-Medium", color: "red", maxWidth: '60%'}}>Report or Block {this.props.firstname_display}</Text>
          </TouchableOpacity>:<View></View>}
            <View style={{height: 80, width: '100%'}}>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
      <View>
        <Dialog.Container visible={this.state.reportUserDialog}>
          <Dialog.Title>Report {this.state.report_username}</Dialog.Title>
          <Dialog.Description>
            Why are you reporting {this.state.report_username}?
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
            <Dialog.Button onPress={() => this._report()} label="Report" />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.reportUserDialogSubmitted}>
            <Dialog.Title>Report Submitted</Dialog.Title>
            <Dialog.Description>
              Thanks for your report! We are going to look into it. You can also block this user from seeing your profile, messaging you privately, or seeing your posts. They will still be visible in group chats.
            </Dialog.Description>
            <Dialog.Button onPress={() => { reportCalled = true; this.setState({reportUserDialogSubmitted: false})}} label="Close" />
            <Dialog.Button onPress={() => { blockCalled = true; this.setState({reportUserDialogSubmitted: false}); this.blockUser()}} label="Block User" />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.showFriendAdded}>
            <Dialog.Title>Friend Added</Dialog.Title>
            <Dialog.Description>
              You and {this.props.firstname_display} are now friends.
            </Dialog.Description>
            <Dialog.Button onPress={() => { friendAcceptedCalled = true; this.setState({showFriendAdded: false})}} label="Ok" />
          </Dialog.Container>
        </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
