import React, {Component} from "react"
import { Image, StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"

import Container from '../elements/Container';

import { apiCall, imageUpload } from "../utilities/APICall";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Reviews extends Component {

  state = {
    height1: 25,
    name: "",
    height2: 25,
    contact: "",
    height3: 25,
    artId: "",
    width: 0,
    height: 0,
    uploadingImage: false
  }

  componentDidMount() {
  }

  submitReview = async () => {
    if(this.state.name.length == 0 || this.state.contact.length == 0 || this.state.artId.length == 0){
      return;
    }
    var details = {
				"tokPass": window.tokPass,
				"contact": this.state.contact,
				"artId": this.state.artId,
				"name": this.state.name
        };
    var resp = await apiCall("submitArt.php", details);
    if(resp == "success"){

      this.props.changePage("thanks");

    }
    else{
      alert("There seems to be an error. Try again later.");
    }

  }

  _handleName = (input) => {
    this.setState({
      name: input
    })
  }

  _handleContact = async (input) => {
    this.setState({
      contact: input
    })
  }

  _handleFileChange = async () => {
    var file_input = document.getElementById("file_input").files[0];
    if(file_input == null || file_input == undefined){
      //do nothing
      return;
    }

    this.setState({
      uploadingImage: true
    });

    //upload file
    const resp = await imageUpload(file_input);

    if(resp == undefined || resp == null){
      return;
    }

    if(resp.status == "dataerror"){
      alert("There seems to be an issue with that image.");
      return;
    }

    //set artId to returned value
    this.setState({
      artId: resp.status,
      uploadingImage: false
    });

  }

  render() {
    console.disableYellowBox = true;

    return (
      <Container>
						<ScrollView showsVerticalScrollIndicator={false} style={{height: 'auto', width: '100%', maxWidth: 510, padding: 10, paddingTop: 50}}>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                <View style={{marginBottom: 20}}>
                  <Text style={{fontWeight: "bold", fontSize: 20, fontFamily: "Questrial", color: "black"}}>Welcome to the first ever...</Text>
                  <View style={{height: '50%', width: '100%'}}>
                    <Image source={{uri: "./logo-white.png"}} style={{marginTop: 10, marginBottom: 10, height: '100%', width: '100%'}} resizeMode={"contain"} />
                  </View>
                  <Text style={{fontWeight: "bold", fontSize: 20, fontFamily: "Questrial", color: "black", textAlign: "right"}}>SPOOKY👻 art contest!</Text>
                  <Text style={{marginTop: 15, fontSize: 16, fontFamily: "Questrial", fontWeight: "bold", color: "black", textAlign: "center"}}>Ready to show off your art skills and enter for a chance to win a $75 Uber Eats gift card?</Text>
                  <Text style={{fontWeight: "regular", fontSize: 50, marginTop: 10, fontFamily: "Questrial", color: "black", textAlign: "center"}}>🦇🕯️</Text>
                </View>
                <View style={{width: '90%', height: 'auto'}}>
                  <View style={{height: 50, width: '100%'}}></View>
                  <Text style={{fontWeight: "bold", fontSize: 16, marginTop: 20, fontFamily: "Questrial", color: "black"}}>Your Name:</Text>
                  <TextInput
                    value={this.state.name}
                    numberOfLines={1}
                    maxLength={128}
                    placeholder={"Pippy the Penguin"}
                    placeholderTextColor={"white"}
                    style={{
                      minHeight: this.state.height1,
                      width: '100%',
                      borderBottomWidth: 2,
                      borderColor: "black",
                      fontFamily: "Questrial",
                      fontSize: 16,
                      padding: 5,
                      color: "white",
                      marginTop: 5
                    }}
                    onChange={(event) => {
                      this.setState({height1: event.nativeEvent.srcElement.scrollHeight});
                    }}
                    onChangeText={(input) => this._handleName(input)}
                  />
                  <Text style={{fontWeight: "bold", fontSize: 16, marginTop: 40, fontFamily: "Questrial", color: "black"}}>How should we reach you?</Text>
                  <TextInput
                    value={this.state.contact}
                    numberOfLines={1}
                    maxLength={256}
                    placeholder={"Type your email or Instagram handle"}
                    placeholderTextColor={"white"}
                    style={{
                      minHeight: this.state.height2,
                      width: '100%',
                      borderBottomWidth: 2,
                      borderColor: "black",
                      fontFamily: "Questrial",
                      fontSize: 16,
                      padding: 5,
                      color: "white",
                      marginTop: 5
                    }}
                    onChange={(event) => {
                      this.setState({height2: event.nativeEvent.srcElement.scrollHeight});
                    }}
                    onChangeText={(input) => this._handleContact(input)}
                  />
                  <Text style={{fontWeight: "bold", fontSize: 16, marginTop: 40, fontFamily: "Questrial", color: "black"}}>Your art:</Text>
                  <input id="file_input" type="file" accept="image/*" style={{marginTop: 10}} onChange={() => this._handleFileChange()} />
                  <Text style={{fontWeight: "bold", fontSize: 16, marginTop: 40, fontFamily: "Questrial", color: "black"}}>Preview:</Text>
                  {(this.state.artId.length > 0)?
                  <View style={{marginTop: 10, height: 'auto', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      onLoad={() => Image.getSize('https://rumine.ca/apiv3/image.php?id=' + this.state.artId, (width, height) => { var divisor = windowWidth; if (windowWidth > 510) { divisor = 510; } var ratio = (width > divisor)?divisor/width:width/divisor; this.setState({width: divisor, height: height*ratio})})}
                      source={{uri: 'https://rumine.ca/apiv3/image.php?id=' + this.state.artId}} style={{height: this.state.height, width: this.state.width}}
                      resizeMode={"contain"} />
                  </View>
                  :
                  (this.state.uploadingImage)?
                  <View style={{height: 40, width: '100%'}}>
                    <ActivityIndicator size="large" color="black"></ActivityIndicator>
                  </View>
                  :
                  <View style={{height: 40, width: '100%'}}>
                  </View>}
                </View>
                <Text style={{fontWeight: "bold", fontSize: 16, marginTop: 40, fontFamily: "Questrial", color: "black", textAlign: 'center'}}>Looks good?</Text>
                <View style={{width: '100%', justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 5}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.submitReview()} style={{marginTop: 10, height: 50, minWidth: 180, width: 'auto', backgroundColor: 'black', borderRadius: 50, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{padding: 15, fontSize: 14, fontWeight: 'bold', fontFamily: "Questrial", color: "white", textAlign: "center"}}>Submit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{height: 100, width: '100%'}}></View>
							</View>
						</ScrollView>
				</Container>
   );
 }
}

const styles = StyleSheet.create({
  myStarStyle: {
    color: 'yellow',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  }
});

export default Reviews;
