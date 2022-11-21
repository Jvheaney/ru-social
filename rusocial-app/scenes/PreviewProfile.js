import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';
import badges from '../badges.js'

import { Actions } from 'react-native-router-flux';
//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Profile from '../components/Profile';
import ProfileBadge from '../components/ProfileBadge';
import SpotifyBubble from '../components/SpotifyBubble';
import InterestBubble from '../components/InterestBubble';
import ProfileInCard from '../components/ProfileInCard';
import FriendProfileCard from '../components/FriendProfileCard';
import cache from '../in_memory_cache.js';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let gotArtistData = false;

class Swipe extends Component {

  getWindowDimension(event) {
      this.device_width = event.nativeEvent.layout.width,
      this.device_height = event.nativeEvent.layout.height

      var bottomBarIsOpen = (this.device_height<screenHeight);
      this.setState({
        bottomBarIsOpen: bottomBarIsOpen
      })

    }

  componentDidMount() {
    this.setState({
      topNotchOffset: StaticSafeAreaInsets.safeAreaInsetsTop,
      bottomNotchOffset: StaticSafeAreaInsets.safeAreaInsetsBottom,
      bottomHeight: (StaticSafeAreaInsets.safeAreaInsetsBottom == 0 && Platform.OS == "android")?40:StaticSafeAreaInsets.safeAreaInsetsBottom
    });
    if(cache.in_memory_cache == undefined || cache.in_memory_cache == null || cache.in_memory_cache['friends_profiles'] == undefined || cache.in_memory_cache['friends_profiles'] == null || cache.in_memory_cache['dating_profiles'] == undefined || cache.in_memory_cache['dating_profiles'] == null){
      cache.in_memory_cache = {
        'friends_profiles': {},
        'dating_profiles': {}
      };
    }
    if(!this.props.fromFriendsProfile && !this.props.fromFriendsConvo){
      this.getUserProfile();
    }
    else{
      //get friends profile from server
      this.getFriendsProfile();
    }
  }

  componentWillUnmount() {
    gotArtistData = false;
  }

  state = {
    topNotchOffset: 0,
    bottomNotchOffset: 0,
    bottomBarIsOpen: false,
    userid: this.props.userid,
    firstname_display: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].firstname_display:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].firstname_display:"",
    birthdate: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].birthdate:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].birthdate:"",
    program: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].program:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].program:"",
    year: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].year:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].year:"",
    pronouns: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].pronouns:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].pronouns:"",
    lookingfor: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].lookingfor:"",
    bio: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].bio:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].bio:"",
    badges: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].badges:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].badges:"",
    top_5_spotify: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].top_5_spotify:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].top_5_spotify:"",
    interests: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].interests:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].interests:"",
    image0: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].image0:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].image0:"",
    image1: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].image1:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].image1:"",
    image2: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].image2:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].image2:"",
    image3: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"].image3:"":(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"].image3:"",
    classes: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?cache.in_memory_cache['friends_profiles'][((this.props.userid)?this.props.userid:"me")?(this.props.userid)?this.props.userid:"me":"me"].classes:"":"",
    temp_spotifyData: [],
    loading: (this.props.fromFriendsProfile || this.props.fromFriendsConvo)?(cache.in_memory_cache['friends_profiles'][(this.props.userid)?this.props.userid:"me"])?false:true:(cache.in_memory_cache['dating_profiles'][(this.props.userid)?this.props.userid:"me"])?false:true,
    noProfile: false
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
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
          gotArtistData = true;
          const artist_data = this.getArtists(JSON.parse(artist_ids));
        }

        return(<View></View>);
      }

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

    capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    renderBadges = (badges_passed) => {
      var data = JSON.parse(badges_passed);
      var badges_to_render = [];
      for (var i = 0; i<data.length; i++) {
        badges_to_render.push(
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
            <ProfileBadge type={data[i]} />
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
        interests_to_return.push(<InterestBubble disabled func={this.removeInterest} key={data[i]} interest={this.capitalizeFirstLetter(data[i])} />);
      }
      return (interests_to_return);
    }

  getUserProfile = () => {
    if(this.props.fromMatchConvo){
      var details = {
        "token": GLOBAL.authToken,
        "otherUserId": this.props.userid
        };
    }
    else{
      var details = {
        "token": GLOBAL.authToken,
        };
    }


      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/p', {
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
          alert("There was an error getting this profile. Please try again later.");
        }
        else{
          if(responseJson.token != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          var userData = responseJson.status;
          var profData = userData.profile;
          if(this.props.fromMatchConvo){
            cache.in_memory_cache['dating_profiles'][this.props.userid] = profData;
            cache.in_memory_cache['dating_profiles'][this.props.userid].fetched = Math.round((new Date()).getTime()/1000);
          }
          else{
            cache.in_memory_cache['dating_profiles']["me"] = profData;
            cache.in_memory_cache['dating_profiles']["me"].fetched = Math.round((new Date()).getTime()/1000);
          }
          this.setState({
            firstname_display: profData.firstname_display,
            birthdate: profData.birthdate,
            program: profData.program,
            year: profData.year,
            pronouns: profData.pronouns,
            lookingfor: profData.lookingfor,
            bio: profData.bio,
            badges: profData.badges,
            top_5_spotify: profData.top_5_spotify,
            interests: profData.interests,
            image0: profData.image0,
            image1: profData.image1,
            image2: profData.image2,
            image3: profData.image3
          });
          }
        })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  getFriendsProfile = () => {
    if(this.props.fromFriendsConvo){
      if(this.props.userid == "me"){
        var details = {
          "token": GLOBAL.authToken
          };
      }
      else{
        var details = {
          "token": GLOBAL.authToken,
          "userid": this.props.userid
          };
      }
    }
    else{
      var details = {
        "token": GLOBAL.authToken,
        };
    }


      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/fp/gp', {
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
          this.setState({
            loading: false,
            noProfile: true
          });
        }
        else{
          if(responseJson.token != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          var userData = responseJson.data;
          if(userData == "nothing-to-show"){
            this.setState({
              loading: false,
              noProfile: true
            });
          }
          var profData = userData;
          if(this.props.fromFriendsConvo){
            cache.in_memory_cache['friends_profiles'][this.props.userid] = profData;
            cache.in_memory_cache['friends_profiles'][this.props.userid].fetched = Math.round((new Date()).getTime()/1000);
          }
          else{
            cache.in_memory_cache['friends_profiles']["me"] = profData;
            cache.in_memory_cache['friends_profiles']["me"].fetched = Math.round((new Date()).getTime()/1000);
          }
          this.setState({
            firstname_display: profData.firstname_display,
            birthdate: profData.birthdate,
            program: profData.program,
            year: profData.year,
            pronouns: profData.pronouns,
            bio: profData.bio,
            badges: profData.badges,
            top_5_spotify: profData.top_5_spotify,
            interests: profData.interests,
            classes: profData.classes,
            image0: profData.image0,
            image1: profData.image1,
            image2: profData.image2,
            image3: profData.image3,
            loading: false,
            noProfile: false,
            isMe: profData.isMe,
            isFriend: profData.isFriend
          });
          }
        })
      .catch((error) => {
        this.setState({
          loading: false,
          noProfile: true
        });
      });
  }


  render() {
    console.disableYellowBox = true;

    return (
      //
      <View>
      {(!this.props.fromFriendsProfile && !this.props.fromFriendsConvo)?
      <View style={{height: screenHeight, width: screenWidth}} onLayout={(event) => this.getWindowDimension(event)}>
      <SafeAreaView style={{
        backgroundColor: "#ffffff"
      }}>
      </SafeAreaView>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
          {(!this.props.fromMatchConvo)?<Text style={{fontSize: 20, textAlign: "center", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Dating Profile</Text>:<Text style={{fontSize: 20, textAlign: "center", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Match</Text>}
          <View style={{height: 50, width: 50}}></View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{height: '100%', width: '100%'}}>
          <View>
          </View>
          <View style={{width: screenWidth, height: screenHeight*0.75}}>
            <ProfileInCard
              preview={false}
              images={(this.state.image3 == undefined)?(this.state.image2 == undefined)?(this.state.image1 == undefined)?[this.state.image0]:[this.state.image0, this.state.image1]:[this.state.image0, this.state.image1, this.state.image2]:[this.state.image0, this.state.image1, this.state.image2, this.state.image3]}
              allowClick={this.state.allowClick}
              pass={this}
              renderNextFunc={() => this.getMatch()}
              userid={this.state.userid}
              username={this.state.firstname_display}
              birthdate={this.state.birthdate}
              program={this.state.program}
              year={this.state.year}
              pronouns={this.state.pronouns}
              lookingFor={this.state.lookingfor}
              openFullProfile={() => {this.setState({full: true})}}
            />
          </View>
        {(true)?
          <View style={{minHeight: 200, height: 'auto', width: screenWidth, backgroundColor: "white", borderRadius: 15, top: -20}}>
            {(this.state.bio && this.state.bio.length > 0)?
                <View style={{height: 'auto', minHeight: screenWidth*0.15, width: screenWidth}}>
                  <View style={{padding: 20, justifyContent: "center"}}>
                    <Text style={{textAlign: "left", fontSize: 20, color: "black", fontFamily: "Raleway-Regular"}}>{this.state.bio}</Text>
                  </View>
                </View>
             :<View></View>}
            {(this.state.badges && this.state.badges.length > 2)?
              <View style={{width: screenWidth, justifyContent: "center", alignItems: "center", paddingTop: 10}}>
              <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>A little about me...</Text>
              <View style={{height: 'auto', width: 200, marginTop: 10, marginBottom: 10, justifyContent: "center"}}>
                {this.renderBadges(this.state.badges)}
              </View>
             </View>
            :<View></View>}
            {(this.state.interests && this.state.interests.length > 2)?
            <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
              <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Interests are...</Text>
              <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                {this.renderInterests(this.state.interests)}
              </View>
            </View>
           :
           <View></View>
           }
           {(this.state.top_5_spotify && this.state.top_5_spotify.length > 0)?
           <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
             <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Top 5 Spotify Artists</Text>
             <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
               {this.renderArtists(this.state.top_5_spotify)}
             </View>
           </View>
          :
          <View></View>
          }
           <View style={{height: 120, width: screenWidth}}>
           </View>
          </View>
          :
        <View></View>}
        </ScrollView>
      </View>
    </View>
    :
    (!this.state.loading && !this.state.noProfile)?
    <View style={{height: screenHeight, width: screenWidth}}>
    <SafeAreaView style={{
      backgroundColor: "#ffffff"
    }}>
    </SafeAreaView>
    <View style={{
      flex: 1,
      height: screenHeight,
      width: screenWidth,
      backgroundColor: "black"
    }}>
    <StatusBar
      barStyle="dark-content" // Here is where you change the font-color
      />
      <View style={{backgroundColor: "white", height: 55, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
        {(this.props.userid == undefined)?<Text style={{fontSize: 20, textAlign: "center", color: "#5bb8ff", fontFamily: "Raleway-Bold"}}>My Friends Profile</Text>:<Text numberOfLines={1} style={{fontSize: 20, textAlign: "center", color: "#5bb8ff", fontFamily: "Raleway-Bold", maxWidth: '60%'}}>{this.state.firstname_display}</Text>}
        <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
      </View>
        <FriendProfileCard
          isMe={this.state.isMe}
          isFriend={this.state.isFriend}
          allowFriending={this.props.allowFriending}
          bottomBarIsOpen={this.state.bottomBarIsOpen}
          topNotch={this.state.topNotchOffset}
          bottomNotch={this.state.bottomNotchOffset}
          userid={this.state.userid}
          preview={true}
          allowReport={this.props.allowReport}
          requestSent={this.state.request_sent}
          firstname_display={this.state.firstname_display}
          pronouns={this.state.pronouns}
          year={this.state.year}
          program={this.state.program}
          top_5_spotify={this.state.top_5_spotify}
          badges={this.state.badges}
          classes={this.state.classes}
          interests={this.state.interests}
          bio={this.state.bio}
          images={(this.state.image3 == undefined || this.state.image3 == "null")?(this.state.image2 == undefined || this.state.image2 == "null")?(this.state.image1 == undefined || this.state.image1 == "null")?[this.state.image0]:[this.state.image0, this.state.image1]:[this.state.image0, this.state.image1, this.state.image2]:[this.state.image0, this.state.image1, this.state.image2, this.state.image3]}
        />
    </View>
    </View>
    :(!this.state.loading && this.state.noProfile)?
  <View style={{height: screenHeight, width: screenWidth}}>
    <SafeAreaView style={{
      backgroundColor: "#ffffff"
    }}>
    </SafeAreaView>
    <View style={{
      flex: 1,
      height: screenHeight,
      width: screenWidth,
      backgroundColor: "white"
    }}>
    <StatusBar
      barStyle="dark-content" // Here is where you change the font-color
      />
      <View style={{backgroundColor: "white", height: 55, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
        <Text style={{fontSize: 20, textAlign: "center", color: "#5bb8ff", fontFamily: "Raleway-Bold"}}>Friend Profile</Text>
        <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
      </View>
      <Text style={{marginTop: 20, fontSize: 15, textAlign: "center", color: "black", fontFamily: "Raleway-Medium", padding: 20}}>This profile is not available for viewing at this time.</Text>
    </View>
  </View>
  :
  <View style={{height: screenHeight, width: screenWidth}}>
    <SafeAreaView style={{
      backgroundColor: "#ffffff"
    }}>
    </SafeAreaView>
    <View style={{
      flex: 1,
      height: screenHeight,
      width: screenWidth,
      backgroundColor: "white"
    }}>
    <StatusBar
      barStyle="dark-content" // Here is where you change the font-color
      />
      <View style={{backgroundColor: "white", height: 55, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
        <Text style={{fontSize: 20, textAlign: "center", color: "#5bb8ff", fontFamily: "Raleway-Bold"}}>My Friend Profile</Text>
        <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
      </View>
    </View>
  </View>
    }
    </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
