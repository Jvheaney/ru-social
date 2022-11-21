import React, {Component} from "react"
import { StyleSheet, Text, View, ScrollView, Dimensions, TextInput } from "react-native"

import Container from '../elements/Container';
import Left from '../elements/Left';
import Submit from '../elements/Submit';

class Instagram extends Component {

  state = {
    height1: 29,
    height2: 29,
    height3: 29,
    height4: 29,
    height5: 29,
    height6: 29,
    height7: 29,
    height8: 29,
    height9: 29,
    height10: 29,
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
    answer6: "",
    answer7: "",
    answer8: "",
    answer9: "",
    answer10: ""
  }

  _handleAnswer1 = (input) => {
    this.setState({
      answer1: input
    })
  }

  _handleAnswer2 = (input) => {
    this.setState({
      answer2: input
    })
  }

  _handleAnswer3 = (input) => {
    this.setState({
      answer3: input
    })
  }

  _handleAnswer4 = (input) => {
    this.setState({
      answer4: input
    })
  }

  _handleAnswer5 = (input) => {
    this.setState({
      answer5: input
    })
  }

  _handleAnswer6 = (input) => {
    this.setState({
      answer6: input
    })
  }

  _handleAnswer7 = (input) => {
    this.setState({
      answer7: input
    })
  }

  _handleAnswer8 = (input) => {
    this.setState({
      answer8: input
    })
  }

  _handleAnswer9 = (input) => {
    this.setState({
      answer9: input
    })
  }

  _handleAnswer10 = (input) => {
    this.setState({
      answer10: input
    })
  }

  cleanSmartPunctuation = (value) => {
    if(value != null){
      return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
    }
    else{
      return "";
    }
  }

  _goToNextScreen = async () => {
    //Trim and clean all answers
    var a1 = this.cleanSmartPunctuation(this.state.answer1.trim());
    var a2 = this.cleanSmartPunctuation(this.state.answer2.trim());
    var a3 = this.cleanSmartPunctuation(this.state.answer3.trim());
    var a4 = this.cleanSmartPunctuation(this.state.answer4.trim());
    var a5 = this.cleanSmartPunctuation(this.state.answer5.trim());
    var a6 = this.cleanSmartPunctuation(this.state.answer6.trim());
    var a7 = this.cleanSmartPunctuation(this.state.answer7.trim());
    var a8 = this.cleanSmartPunctuation(this.state.answer8.trim());
    var a9 = this.cleanSmartPunctuation(this.state.answer9.trim());
    var a10 = this.cleanSmartPunctuation(this.state.answer10.trim());

    //Check all answers have a length
    if(a1.length == 0){
      alert("Please add an answer for question 1.");
      return;
    }
    if(a2.length == 0){
      alert("Please add an answer for question 2.");
      return;
    }
    if(a3.length == 0){
      alert("Please add an answer for question 3.");
      return;
    }
    if(a4.length == 0){
      alert("Please add an answer for question 4.");
      return;
    }
    if(a5.length == 0){
      alert("Please add an answer for question 5.");
      return;
    }
    if(a6.length == 0){
      alert("Please add an answer for question 6.");
      return;
    }
    if(a7.length == 0){
      alert("Please add an answer for question 7.");
      return;
    }
    if(a8.length == 0){
      alert("Please add an answer for question 8.");
      return;
    }
    if(a9.length == 0){
      alert("Please add an answer for question 9.");
      return;
    }
    if(a10.length == 0){
      alert("Please add an answer for question 10.");
      return;
    }

    //Save to parent
    this.props.pass.answer1 = a1;
    this.props.pass.answer2 = a2;
    this.props.pass.answer3 = a3;
    this.props.pass.answer4 = a4;
    this.props.pass.answer5 = a5;
    this.props.pass.answer6 = a6;
    this.props.pass.answer7 = a7;
    this.props.pass.answer8 = a8;
    this.props.pass.answer9 = a9;
    this.props.pass.answer10 = a10;

    //Submit
    const resp = await this.props.pass.submitAnswers();

    console.log(resp);

    if(resp == "success"){
      //Go to thank you
      this.props.pass.setState({screen: 3})
    }
    else{
      alert("There seems to be an error. Please let us know on Instagram, @ru_minee.");
    }


  }


  render() {
    console.disableYellowBox = true;

    return (
      <Container>
					<View style={{height: 'auto', width: 100, marginTop: 30, marginBottom: 30, flexDirection: "row", justifyContent: "center"}}>
						<View style={{marginRight: 5, height: 15, width: 15, backgroundColor: "gray", borderRadius: 10}}></View>
						<View style={{marginRight: 5, height: 15, width: 15, backgroundColor: "gray", borderRadius: 10}}></View>
						<View style={{height: 15, width: 15, backgroundColor: "black", borderRadius: 10}}></View>
					</View>
          <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
					<View style={{height: 'auto', width: 'auto', justifyContent: "center", alignItems: "center", marginBottom: 50}}>
						<View style={{height: 'auto', width: 'auto', padding: 10}}>
							<Text style={{fontWeight: "bold", fontSize: 25, fontFamily: "Questrial", marginBottom: 30}}>Now the fun part! ✍️</Text>
							<Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 10}}>1. What's your idea of the perfect first date?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer1}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"A romantic wagon ride through Victoria Street"}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height1,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height1: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer1(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>2. If you could go anywhere in the world, where would you go?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer2}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"SLC 7, oh I miss it so much..."}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height2,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height2: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer2(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>3. What are your best qualities?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer3}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"I put on pants before attending Zoom classes, I bake bread..."}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height3,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height3: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer3(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>4. What have you always wanted to do but haven’t yet?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer4}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"Find the exit to Kerr Hall"}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height4,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height4: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer4(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>5. What do you value in a relationship?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer5}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"My partner not being AI is pretty crucial"}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height5,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height5: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer5(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>6. If you had a million dollars what would you do with it?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer6}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"Finally buy all my textbooks from the Ryerson bookstore"}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height6,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height6: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer6(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>7. If you’re stranded on an island, what three things do you bring?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer7}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={'A pilot, a plane, and a map'}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height7,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height7: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer7(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>8. If you could invite anyone in history to dinner, who would it be?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer8}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"Debby"}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height8,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height8: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer8(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>9. If your house was on fire, what would you grab first?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer9}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"Cup of coffee to deal with this"}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height9,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height9: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer9(input)}
									 />
								</View>
							</View>
              <Text style={{fontWeight: "medium", fontSize: 18, fontFamily: "Questrial", marginTop: 80}}>10. What do you hate about dating?</Text>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
								<View style={{flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 15}}>
									<TextInput
                    value={this.state.answer10}
                    numberOfLines={2}
										maxLength={2048}
                    placeholder={"Let me think..."}
                    placeholderTextColor={"#cecece"}
                    multiline
										style={{
											minHeight: this.state.height10,
											width: '100%',
											borderBottomWidth: 1,
											borderColor: "#b1b1b1",
											fontFamily: "Questrial",
											fontSize: 18,
                      padding: 5
										}}
                    onChange={(event) => {
	                     this.setState({height10: event.nativeEvent.srcElement.scrollHeight});
                     }}
                     onChangeText={(input) => this._handleAnswer10(input)}
									 />
								</View>
							</View>
							<View style={{height: 'auto', width: '100%', marginTop: 50, flexDirection: "row", justifyContent: "center", justifyContent: "space-between"}}>
								<Left func={() => this.props.pass.setState({screen: 1})} />
								<Submit func={() => this._goToNextScreen()} />
							</View>
						</View>
					</View>
        </ScrollView>
				</Container>
   );
 }
}

export default Instagram;
