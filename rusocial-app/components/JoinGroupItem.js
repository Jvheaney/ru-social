import React, {Component} from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { apiCall } from '../utilities/Connector'

import TitleText from '../elements/TitleText';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

class ChatTopNav extends Component {

  _joinGroup = async () => {
    this.props.pass.setState({isMember: true});
    var formdata = new FormData();
    formdata.append("groupid", this.props.groupid);
    const resp = await apiCall("/g/j",formdata);
    if(resp.status == "success"){
    }
    else{
      this.props.pass.setState({isMember: false});
      alert("There was a problem joining this group");
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
      <>
        <View style={{height: 100, justifyContent: "center", padding: 10}}>
          <View style={{height: 60, borderRadius: 20}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this._joinGroup()}  style={{borderWidth: 1, borderColor: "white", height: 60, width: '100%', borderRadius: 20, backgroundColor: "#6970ff", position: "absolute", bottom: 0, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
              <View style={{height: 30, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <TitleText size={22} color={"white"} text={"Join Group"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
   );
 }
}

export default ChatTopNav;
