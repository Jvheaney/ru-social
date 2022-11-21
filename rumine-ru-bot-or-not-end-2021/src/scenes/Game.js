import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions, TextInput, ScrollView, TouchableOpacity } from "react-native"

import Container from '../elements/Container';
import Left from '../elements/Left';
import Right from '../elements/Right';

var questions = [{questionNum: 1, questionText: "What's your idea of the perfect first date?"},{questionNum: 2, questionText: "If you could go anywhere in the world, where would you go?"},{questionNum: 3, questionText: "What are your best qualities?"},{questionNum: 4, questionText: "What have you always wanted to do but haven’t yet?"},{questionNum: 5, questionText: "What do you value in a relationship?"},{questionNum: 6, questionText: "If you had a million dollars what would you do with it?"},{questionNum: 7, questionText: "If you’re stranded on an island, what three things do you bring?"},{questionNum: 8, questionText: "If you could invite anyone in history to dinner, who would it be?"},{questionNum: 9, questionText: "If your house was on fire, what would you grab first?"},{questionNum: 10, questionText: "What do you hate about dating?"}];

var selected_question = 0;

class Preferences extends Component {

  state = {
    messages: [],
    questionsAsked: 0,
    questionsPicked: {},
    selectedQuestion: false,
    pickAContestantModal: false
  }

  renderMessages = () => {
    console.log(this.state.messages);
    var messages_to_return = [];
    for(var i = 0; i<this.state.messages.length; i++){
      if(this.state.messages[i].side == "right"){
        messages_to_return.push(
          <View style={{flexDirection: "row-reverse", padding: 5}}>
            <View style={{backgroundColor: "#ff5b99", borderRadius: 20, padding: 8, maxWidth: '80%'}}>
              <Text style={{fontSize: 14, fontFamily: "Questrial", color: "white"}}>{this.state.messages[i].text}</Text>
            </View>
          </View>);
      }
      else if(this.state.messages[i].side == "left"){
        messages_to_return.push(
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 10, fontFamily: "Questrial", color: "gray", marginLeft: 45}}>Contestant {this.state.messages[i].contestant_number}</Text>
          <View style={{flexDirection: "row", padding: 5}}>
            <View style={{height: 30, width: 30, borderRadius: 15, backgroundColor: "gray", marginRight: 5, justifyContent: "center", alignItems: "center"}}>
              {(this.state.messages[i].contestant_number == 1)?
                <Text style={{fontSize: 20, marginLeft: 2, fontFamily: "Questrial", color: "white"}}>😉</Text>
                :(this.state.messages[i].contestant_number == 2)?
                <Text style={{fontSize: 20, marginLeft: 2, fontFamily: "Questrial", color: "white"}}>😜</Text>
                :
                <Text style={{fontSize: 20, marginLeft: 2, fontFamily: "Questrial", color: "white"}}>🤫</Text>
              }
            </View>
            <View style={{backgroundColor: "#d6d6d6", borderRadius: 20, padding: 8, maxWidth: '70%'}}>
              <Text style={{fontSize: 14, fontFamily: "Questrial", color: "black"}}>{this.state.messages[i].text}</Text>
            </View>
          </View>
          </View>);
      }
    }
    return(messages_to_return);
  }

  renderQuestions = () => {
    var questions_to_render = [];
    for(var i = 0; i<questions.length; i++){
      if(this.state.questionsPicked[questions[i].questionNum]){
        questions_to_render.push(<View></View>);
      }
      else{
        let index = questions[i].questionNum;
        questions_to_render.push(
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.addQuestion(index)} style={{height: 'auto', width: '90%', borderRadius: 15, margin: 5, padding: 10, backgroundColor: "#ff5b99", justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 12, fontFamily: "Questrial", color: "white"}}>{questions[i].questionText}</Text>
          </TouchableOpacity>
        );
      }
    }
    return(questions_to_render);
  }

  addQuestion = (num) => {
    if(this.state.questionsAsked >= 5){
      return;
    }
    var message = {};
    message.side="right";
    if(num == 1){
      message.text = "What's your idea of the perfect first date?";
    }
    else if(num == 2){
      message.text = "If you could go anywhere in the world, where would you go?";
    }
    else if(num == 3){
      message.text = "What are your best qualities?";
    }
    else if(num == 4){
      message.text = "What have you always wanted to do but haven’t yet?";
    }
    else if(num == 5){
      message.text = "What do you value in a relationship?";
    }
    else if(num == 6){
      message.text = "If you had a million dollars what would you do with it?";
    }
    else if(num == 7){
      message.text = "If you’re stranded on an island, what three things do you bring?";
    }
    else if(num == 8){
      message.text = "If you could invite anyone in history to dinner, who would it be?";
    }
    else if(num == 9){
      message.text = "If your house was on fire, what would you grab first?";
    }
    else if(num == 10){
      message.text = "What do you hate about dating?";
    }
    var arr = this.state.messages;
    arr.push(message);
    var obj = this.state.questionsPicked;
    obj[num] = true;
    this.setState({
      messages: arr,
      questionsAsked: this.state.questionsAsked+1,
      questionsPicked: obj
    })
    setTimeout(() => {this.askQuestion(num)},500);
  }

  askQuestion = async (num) => {
    //Fetch answers from BE
      return await fetch('https://rumine.dating/vday/fetchAnswer.php?q=' + num, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }).then((response) => response.json())
        .then((responseJson) => {
					if(responseJson == "fail"){
						console.log("fail");
					}
					else{
						console.log(responseJson);
            var data = JSON.parse(responseJson);
            console.log(data);
            let a1 = data[0];
            let a2 = data[1];
            let a3 = data[2];

            var arr = this.state.messages;
            arr.push(a1);
            setTimeout(() => {
              this.setState({
                messages: arr
              });
              arr.push(a2);
              setTimeout(() => {
                this.setState({
                  messages: arr
                });
                arr.push(a3);
                setTimeout(() => {
                  this.setState({
                    messages: arr
                  })
                }, 1000);
              }, 800);
            }, 600);
					}
      })
      .catch((error) => {
        console.log(error);
        alert("We're sorry, there seems to be an error. Please let us know on Instagram, @ru_minee.")
      });


  }

  pickContestant = (num) => {
    this.props.pass.pickedContestant = num;
    this.props.pass.setState({screen: 2});
  }


  render() {
    console.disableYellowBox = true;

    return (
      <Container>
        <View style={{height: '100%', width: '100%', justifyContent: "center", alignItems: "center"}}>
          <View style={{height: '100%', width: '100%', maxWidth: 510}}>

            <View style={{height: '70%', width: '100%', paddingTop: 50}}>
              <ScrollView
                ref={ref => {this.scrollView = ref}}
                onContentSizeChange={() => {try{this.scrollView.scrollToEnd({animated: true})}catch(e){}}}>
                {this.renderMessages()}
              </ScrollView>
            </View>

            <View style={{height: '30%', width: '100%', backgroundColor: "#e0e0e0", borderTopWidth: 3, borderColor: "#ff5b99" }}>
              <View style={{height: 40, width: '100%', flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#bfbfbf"}}>
                <View style={{height: 'auto', width: 'auto', marginLeft: 5, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontWeight: "bold", padding: 10, fontSize: 14, fontFamily: "Questrial", color: "black"}}>{this.state.questionsAsked}/5 Questions Asked</Text>
                </View>
              </View>
              <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
                {this.renderQuestions()}
              </ScrollView>
            </View>

            <View style={{position: "absolute", top: 0, height: 50, width: '100%', borderBottomWidth: 3, backgroundColor: "white", borderColor: "#ff5b99", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <View style={{height: 50, width: 50}}></View>
              <Text style={{fontWeight: "bold", fontSize: 18, fontFamily: "Questrial", color: "#ff5b99"}}>RU Bot or Not</Text>
              <TouchableOpacity activeOpacity={0.4} onPress={() => this.setState({ pickAContestantModal: true })} style={{height: 50, width: 50, justifyContent: "center", alignItems: "center"}}><Text style={{fontSize: 25}}>❤️</Text></TouchableOpacity>
            </View>

          </View>
        </View>
        {(this.state.pickAContestantModal)?
        <View style={{position: "absolute", backgroundColor: 'rgba(0,0,0,0.5)', height: '100%', width: '100%', maxWidth: 510, justifyContent: "center", alignItems: "center"}}>
          <View style={{height: 'auto', width: '90%', backgroundColor: "white", borderRadius: 20, alignItems: "center", padding: 20}}>
            <Text style={{fontWeight: "bold", fontSize: 25, fontFamily: "Questrial", color: "#ff5b99", marginTop: 10}}>Ready to pick?</Text>
            <Text style={{fontWeight: "medium", fontSize: 16, fontFamily: "Questrial", color: "black", marginTop: 20, textAlign: "center"}}>Let's see how you do! Our fingers are crossed you pick the human, but, trust me, we'll be laughing if you don't.</Text>
            <View style={{height: '100%', width: '100%'}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.pickContestant(1)} style={{height: 100, width: '100%', backgroundColor: "#ff5b99", borderRadius: 20, marginTop: 10, padding: 10, alignItems: "center", flexDirection: "row"}}>
                <View style={{height: 50, width: 50, borderRadius: 30, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontWeight: "medium", fontSize: 30, fontFamily: "Questrial", color: "white"}}>😉</Text>
                </View>
                <Text style={{fontWeight: "medium", marginLeft: 10, fontSize: 20, fontFamily: "Questrial", color: "white"}}>Contestant 1</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.pickContestant(2)} style={{height: 100, width: '100%', backgroundColor: "#ff5b99", borderRadius: 20, marginTop: 10, padding: 10, alignItems: "center", flexDirection: "row"}}>
                <View style={{height: 50, width: 50, borderRadius: 30, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontWeight: "medium", fontSize: 30, fontFamily: "Questrial", color: "white"}}>😜</Text>
                </View>
                <Text style={{fontWeight: "medium", marginLeft: 10, fontSize: 20, fontFamily: "Questrial", color: "white"}}>Contestant 2</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.pickContestant(3)} style={{height: 100, width: '100%', backgroundColor: "#ff5b99", borderRadius: 20, marginTop: 10, padding: 10, alignItems: "center", flexDirection: "row"}}>
                <View style={{height: 50, width: 50, borderRadius: 30, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontWeight: "medium", fontSize: 30, fontFamily: "Questrial", color: "white"}}>🤫</Text>
                </View>
                <Text style={{fontWeight: "medium", marginLeft: 10, fontSize: 20, fontFamily: "Questrial", color: "white"}}>Contestant 3</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ pickAContestantModal: false })} style={{position: "absolute", top: 5, left: 10, height: 30, width: 30, justifyContent: "center", alignItems: "center"}}>
              <Text style={{fontWeight: "bold", fontSize: 25, fontFamily: "Questrial", color: "black"}}>x</Text>
            </TouchableOpacity>
          </View>
        </View>
        :<View></View>}
				</Container>
   );
 }
}

export default Preferences;
