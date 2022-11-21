import React, {Component} from 'react';
import { Image, TextInput, TouchableOpacity, Dimensions, ScrollView, StatusBar, View, Text } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LinearGradient from 'react-native-linear-gradient';

import TitleText from '../elements/TitleText';
import Container from '../elements/Container';
import ScalingImage from '../elements/ScalingImage';
import FastImage from 'react-native-fast-image'

import { imageURL } from '../utilities/Connector';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

class ViewMediaSet extends Component {

  state = {
  }

  render() {

    return (
      //
      <Container bc="black">
      <StatusBar
         barStyle={"light-content"}  // Here is where you change the font-color
        />
          <View>
            <View style={{height: screenHeight-20}}>
                <View style={{paddingLeft: 10, height: 40, width: '100%', justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.pop()} style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
                    <EvilIcons name="chevron-left" size={40} color={"white"} />
                  </TouchableOpacity>
                  {(false)?<TouchableOpacity style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
                    <Icon name="share" size={20} color={"white"} />
                  </TouchableOpacity>:<View></View>}
                </View>
                <View style={{height: screenHeight-60, width: '100%', justifyContent: "center", alignItems: "center"}}>
                <ScrollView style={{width: '100%', height: 'auto'}}>
                  {this.props.imageURI.map((image, index) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => Actions.viewFullMedia({"media":"image","imageURI":image})}
                        >
                          <ScalingImage
                            imageURI={imageURL + image}
                            screenWidth={screenWidth}
                            style={{marginBottom: 10}}
                          />
                          <View style={{backgroundColor: "#fff", height: 1, width: screenWidth}} />
                      </TouchableOpacity>
                    )
                  })}
                  <View style={{height: 80, width: '100%'}}></View>
                  </ScrollView>
                </View>
            </View>
          </View>
      </Container>
   );
 }
}

export default ViewMediaSet;
