import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native"

import Container from '../elements/Container';
import Left from '../elements/Left';
import Right from '../elements/Right';

class Instagram extends Component {


  _goToNextScreen = () => {
    var ighandle = this.state.handle.trim();

    //Check for zero length
    if(!(ighandle.length > 0)){
      alert("Please check your Instagram username again.");
      return;
    }

    //Check if first character is @
    if(ighandle[0] == "@"){
      ighandle = ighandle.substring(1);
    }

    //Check instagram username
    var patt = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/);
    if (!patt.test(ighandle)){
        alert("Please check your Instagram username again.");
        return;
    }

    //Save to parent
    this.props.pass.ighandle = ighandle;

    //Switch
    this.props.pass.setState({screen: 1})
  }

  _handleNameChange = (input) => {
    this.setState({
      handle: input
    });
  }

  handleKeyDown = (e) => {
    if (e.nativeEvent.key == "Enter"){
        this._goToNextScreen();
    }
  }

  state = {
    handle: this.props.pass.ighandle
  }

  render() {
    console.disableYellowBox = true;

    return (
      <Container>
					<View style={{position: "absolute", height: 'auto', width: 100, top: 30, flexDirection: "row", justifyContent: "center"}}>
						<View style={{marginRight: 5, height: 15, width: 15, backgroundColor: "black", borderRadius: 10}}></View>
						<View style={{marginRight: 5, height: 15, width: 15, backgroundColor: "gray", borderRadius: 10}}></View>
						<View style={{height: 15, width: 15, backgroundColor: "gray", borderRadius: 10}}></View>
					</View>
					<View style={{height: 'auto', width: '100%', justifyContent: "center", alignItems: "center"}}>
						<View style={{height: 'auto', width: '100%', padding: 10}}>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                <View>
                  <Text style={{fontWeight: "bold", fontSize: 25, fontFamily: "Questrial", marginBottom: 5}}>Let's get started! 🎉</Text>
                  <Text style={{fontWeight: "medium", fontSize: 20, fontFamily: "Questrial", marginTop: 5, marginBottom: 5}}>What's your Instagram?</Text>
                  <Text style={{fontSize: 16, fontFamily: "Questrial", color: "#3c3c3c"}}>This is what we will share with users if they select you.</Text>
                </View>
								<View style={{flexDirection: "row", width: '80%', maxWidth: 300, alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<View style={{height: 25, width: 25}}>
										<Text style={{fontSize: 25, fontFamily: "Questrial", color: "black"}}>@</Text>
									</View>
									<TextInput
                    onChangeText={(input) => this._handleNameChange(input)}
										maxLength={30}
                    placeholder={"ru_minee"}
                    placeholderTextColor={"#cecece"}
										autoCorrect={false}
										autoCapitalize={"none"}
										autoCompleteType={false}
                    onKeyPress={this.handleKeyDown}
                    value={this.state.handle}
										style={{
											height: 40,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 20,
											paddingLeft: 5
										}}
									 />
									 <View style={{height: 25, width: 25}}></View>
								</View>
							</View>
						</View>
					</View>
          <View style={{height: 'auto', width: '90%', maxWidth: 500, marginTop: 50, flexDirection: "row", justifyContent: "center", justifyContent: "space-between"}}>
            <View style={{height: 60, width: 60}}></View>
            <Right func={() => this._goToNextScreen()} />
          </View>
				</Container>
   );
 }
}

export default Instagram;
