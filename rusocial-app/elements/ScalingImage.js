import React, {Component} from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image'

class ScalingImage extends Component {

  state = {
    heightScaled: 1
  }

  render() {

    return (
      //
      <Image
        source={{uri: this.props.imageURI}}
        onLoad={(event) => {
          let width = event.nativeEvent.width;
          let height = event.nativeEvent.height;
          if(width == undefined || height == undefined){
            width = event.nativeEvent.source.width;
            height = event.nativeEvent.source.height;
          }
          var heightScaled = height * ((this.props.screenWidth) / width);
          this.setState({
            heightScaled
          });
        }}
        style={{height: this.state.heightScaled, width: '100%'}}
        resizeMode={"contain"}
     />
   );
 }
}

export default ScalingImage;
