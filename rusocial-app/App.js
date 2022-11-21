/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { Router, Scene, Stack } from 'react-native-router-flux';

import Swipe from './scenes/Swipe';
import Messages from './scenes/Messages';
import Groups from './scenes/Groups';
import GroupTimeline from './scenes/GroupTimeline';
import MatchConvo from './scenes/MatchConvo';
import Settings from './scenes/Settings';
import EditProfile from './scenes/EditProfile';
import EditFriendsProfile from './scenes/EditFriendsProfile';
import ProfileEdit from './scenes/ProfileEdit';
import PreviewProfile from './scenes/PreviewProfile';
import FullImage from './scenes/FullImage';
import Preferences from './scenes/Preferences';
import Login from './scenes/Login';
import CreateProfile from './scenes/CreateProfile';
import CPstep1 from'./scenes/Step1';
import CPstep2 from'./scenes/Step2';
import CPstep3 from'./scenes/Step3';
import SentRequests from'./scenes/SentRequests';
import BlockedUsers from'./scenes/BlockedUsers';
import Contacts from'./scenes/Contacts';
import CreateDatingProfileFromFriends from'./scenes/CreateDatingProfileFromFriends';
import CreateFriendsProfileFromDating from'./scenes/CreateFriendsProfileFromDating';
import DatingCP1 from'./scenes/DatingCP1';
import FriendsCP1 from'./scenes/FriendsCP1';
import SearchScreen from './scenes/SearchScreen';
import FullPost from './scenes/FullPost';
import MakePost from './scenes/MakePost';
import EditPost from './scenes/EditPost';
import ViewFullMedia from './scenes/ViewFullMedia';
import ViewMediaSet from './scenes/ViewMediaSet';
import Help from './scenes/Help';
import ChatSettings from './scenes/ChatSettings';
import GroupMembers from './scenes/GroupMembers';
import CreateGroup from './scenes/CreateGroup';
import SafetyResources from './scenes/SafetyResources';


const App: () => React$Node = () => {
  console.disableYellowBox = true;

  return (
    <>
    <Router>
      <Stack key="root">
        <Scene key="swipe" hideNavBar={true} onEnter={() => Actions.refresh()} component={Swipe} initial />
        <Scene key="matches" hideNavBar={true} component={Messages}   />
        <Scene key="groups" hideNavBar={true} component={Groups}   />
        <Scene key="groupTimeline" hideNavBar={true} component={GroupTimeline}   />
        <Scene key="matchConvo" hideNavBar={true} component={MatchConvo}  />
        <Scene key="settings" hideNavBar={true} component={Settings} />
        <Scene key="editprofile" hideNavBar={true} component={EditProfile}  />
        <Scene key="profileEdit" hideNavBar={true} component={ProfileEdit}  />
        <Scene key="editfriendsprofile" hideNavBar={true} component={EditFriendsProfile} />
        <Scene key="previewprofile" hideNavBar={true} component={PreviewProfile}  />
        <Scene key="fullimage" hideNavBar={true} component={FullImage} />
        <Scene key="preferences" hideNavBar={true} component={Preferences}   />
        <Scene key="login" renderBackButton={()=>{}} back={false} hideNavBar={true} component={Login} />
        <Scene key="createprofile" hideNavBar={true} component={CreateProfile} />
        <Scene key="step1" hideNavBar={true} component={CPstep1} />
        <Scene key="step2" hideNavBar={true} component={CPstep2} />
        <Scene key="step3" hideNavBar={true} component={CPstep3} />
        <Scene key="sentRequests" hideNavBar={true} component={SentRequests} />
        <Scene key="blockedUsers" hideNavBar={true} component={BlockedUsers} />
        <Scene key="contacts" hideNavBar={true} component={Contacts} />
        <Scene key="createDatingProfileFromFriends" hideNavBar={true} component={CreateDatingProfileFromFriends} />
        <Scene key="createFriendsProfileFromDating" hideNavBar={true} component={CreateFriendsProfileFromDating} />
        <Scene key="datingCP1" hideNavBar={true} component={DatingCP1} />
        <Scene key="friendsCP1" hideNavBar={true} component={FriendsCP1} />
        <Scene key="searchScreen" hideNavBar={true} component={SearchScreen} />
        <Scene key="post" hideNavBar={true} component={FullPost} />
        <Scene key="makePost" hideNavBar={true} component={MakePost} />
        <Scene key="editPost" hideNavBar={true} component={EditPost} />
        <Scene key="viewMediaSet" hideNavBar={true} component={ViewMediaSet} />
        <Scene key="viewFullMedia" hideNavBar={true} component={ViewFullMedia} />
        <Scene key="help" hideNavBar={true} component={Help} />
        <Scene key="chatSettings" hideNavBar={true} component={ChatSettings} />
        <Scene key="groupMembers" hideNavBar={true} component={GroupMembers} />
        <Scene key="createGroup" hideNavBar={true} component={CreateGroup} />
        <Scene key="safetyResources" hideNavBar={true} component={SafetyResources} />
      </Stack>
    </Router>
    </>
  );
};

const styles = StyleSheet.create({

});

export default App;
