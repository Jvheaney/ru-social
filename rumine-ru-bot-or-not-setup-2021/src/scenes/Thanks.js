import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native"

import Container from '../elements/Container';
import Left from '../elements/Left';
import Right from '../elements/Right';

class Instagram extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <Container>
					<View style={{height: 'auto', width: '100%', justifyContent: "center", alignItems: "center"}}>
						<View style={{height: 'auto', width: '100%', padding: 10}}>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                <View>
                  <Text style={{fontWeight: "bold", fontSize: 25, fontFamily: "Questrial", marginBottom: 5}}>Got it! 🙏</Text>
                  <Text style={{fontWeight: "medium", fontSize: 20, fontFamily: "Questrial", marginTop: 5, marginBottom: 5}}>Thanks for submitting your answers!</Text>
                  <Text style={{fontSize: 16, fontFamily: "Questrial", color: "#3c3c3c"}}>Come back on Valentine's Day to see if you accidentally fall in love with a bot 😉</Text>
                </View>
							</View>
						</View>
					</View>
				</Container>
   );
 }
}

export default Instagram;
