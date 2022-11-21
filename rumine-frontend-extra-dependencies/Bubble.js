import PropTypes from 'prop-types';
import React from 'react';
import { Text, Clipboard, StyleSheet, TouchableWithoutFeedback, UIManager, TouchableOpacity, View, ViewPropTypes, Dimensions, Platform } from 'react-native';
import QuickReplies from './QuickReplies';
import MessageText from './MessageText';
import MessageImage from './MessageImage';
import MessageVideo from './MessageVideo';
import Time from './Time';
import Color from './Color';
import { isSameUser, isSameDay } from './utils';

import Angry from '../../../assets/svgs/angry-react.svg';
import Haha from '../../../assets/svgs/haha-react.svg';
import Love from '../../../assets/svgs/love-react.svg';
import Sad from '../../../assets/svgs/sad-react.svg';
import Wow from '../../../assets/svgs/wow-react.svg';

let screenWidth = Dimensions.get('window').width;

const styles = {
    left: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-start',
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: Color.leftBubbleBackground,
            marginRight: 60,
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomLeftRadius: 3,
        },
        containerToPrevious: {
            borderTopLeftRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
    }),
    right: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-end',
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: Color.defaultBlue,
            marginLeft: 60,
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomRightRadius: 3,
        },
        containerToPrevious: {
            borderTopRightRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
    }),
    content: StyleSheet.create({
        tick: {
            fontSize: 10,
            backgroundColor: Color.backgroundTransparent,
            color: Color.white,
        },
        tickView: {
            flexDirection: 'row',
            marginRight: 10,
        },
        username: {
            top: -3,
            left: 0,
            fontSize: 12,
            backgroundColor: 'transparent',
            color: '#aaa',
        },
        usernameView: {
            flexDirection: 'row',
            marginHorizontal: 10,
        },
    }),
};
const DEFAULT_OPTION_TITLES = ['Copy Text', 'Cancel'];
export default class Bubble extends React.Component {


    componentDidMount() {
      if (this.props.onRef != null) {
        this.props.onRef(this)
      }
    }

    state = {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      showReactionOptions: false,
      react: (this.props.reaction === undefined)?"":this.props.reaction
    }

    constructor() {
        super(...arguments);
        this.onLongPress = () => {
            const { currentMessage } = this.props;
            if (this.props.onLongPress) {
                this.props.onLongPress(this.context, this.props.currentMessage);
            }
            else if (currentMessage && currentMessage.text) {
                const { optionTitles } = this.props;
                const options = optionTitles && optionTitles.length > 0
                    ? optionTitles.slice(0, 2)
                    : DEFAULT_OPTION_TITLES;
                const cancelButtonIndex = options.length - 1;
                this.context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                }, (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            Clipboard.setString(currentMessage.text);
                            break;
                        default:
                            break;
                    }
                });
            }
        };
    }
    styledBubbleToNext() {
        const { currentMessage, nextMessage, position, containerToNextStyle, } = this.props;
        if (currentMessage &&
            nextMessage &&
            position &&
            isSameUser(currentMessage, nextMessage) &&
            isSameDay(currentMessage, nextMessage)) {
            return [
                styles[position].containerToNext,
                containerToNextStyle && containerToNextStyle[position],
            ];
        }
        return null;
    }
    styledBubbleToPrevious() {
        const { currentMessage, previousMessage, position, containerToPreviousStyle, } = this.props;
        if (currentMessage &&
            previousMessage &&
            position &&
            isSameUser(currentMessage, previousMessage) &&
            isSameDay(currentMessage, previousMessage)) {
            return [
                styles[position].containerToPrevious,
                containerToPreviousStyle && containerToPreviousStyle[position],
            ];
        }
        return null;
    }
    renderQuickReplies() {
        const { currentMessage, onQuickReply, nextMessage, renderQuickReplySend, quickReplyStyle, } = this.props;
        if (currentMessage && currentMessage.quickReplies) {
            const { containerStyle, wrapperStyle, ...quickReplyProps } = this.props;
            if (this.props.renderQuickReplies) {
                return this.props.renderQuickReplies(quickReplyProps);
            }
            return (<QuickReplies {...{
                currentMessage,
                onQuickReply,
                nextMessage,
                renderQuickReplySend,
                quickReplyStyle,
            }}/>);
        }
        return null;
    }
    renderMessageText() {
        if (this.props.currentMessage && this.props.currentMessage.text) {
            const { containerStyle, wrapperStyle, optionTitles, ...messageTextProps } = this.props;
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps);
            }
            return <MessageText {...messageTextProps}/>;
        }
        return null;
    }
    renderMessageImage() {
        if (this.props.currentMessage && this.props.currentMessage.image) {
            const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
            if (this.props.renderMessageImage) {
                return this.props.renderMessageImage(messageImageProps);
            }
            return <MessageImage {...messageImageProps}/>;
        }
        return null;
    }
    renderMessageVideo() {
        if (this.props.currentMessage && this.props.currentMessage.video) {
            const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
            if (this.props.renderMessageVideo) {
                return this.props.renderMessageVideo(messageVideoProps);
            }
            return <MessageVideo {...messageVideoProps}/>;
        }
        return null;
    }
    renderTicks() {
        const { currentMessage, renderTicks, user } = this.props;
        if (renderTicks && currentMessage) {
            return renderTicks(currentMessage);
        }
        if (currentMessage &&
            user &&
            currentMessage.user &&
            currentMessage.user._id !== user._id) {
            return null;
        }
        if (currentMessage &&
            (currentMessage.sent || currentMessage.received || currentMessage.pending)) {
            return (<View style={styles.content.tickView}>
          {!!currentMessage.sent && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
          {!!currentMessage.received && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
          {!!currentMessage.pending && (<Text style={[styles.content.tick, this.props.tickStyle]}>🕓</Text>)}
        </View>);
        }
        return null;
    }
    renderTime() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const { containerStyle, wrapperStyle, textStyle, ...timeProps } = this.props;
            if (this.props.renderTime) {
                return this.props.renderTime(timeProps);
            }
            return <Time {...timeProps}/>;
        }
        return null;
    }
    renderUsername() {
        const { currentMessage, user } = this.props;
        if (this.props.renderUsernameOnMessage && currentMessage) {
            if (user && currentMessage.user._id === user._id) {
                return null;
            }
            return (<View style={styles.content.usernameView}>
          <Text style={[styles.content.username, this.props.usernameStyle]}>
            ~ {currentMessage.user.name}
          </Text>
        </View>);
        }
        return null;
    }
    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props);
        }
        return null;
    }
    renderBubbleContent() {
        return this.props.isCustomViewBottom ? (<View>
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageText()}
        {this.renderCustomView()}
      </View>) : (<View>
        {this.renderCustomView()}
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageText()}
      </View>);
    }

    openReactionMenu = () => {
      this.props.pass.passDismissalToOpenReactions();
      //this.setState({
      //  showReactionOptions: true
      //});
      this.props.pass.setCurrentMessageForOpenReactions(this.props.currentMessage._id, this.props.currentMessage.guid);
    }

    dismissReactionMenu = () => {
      this.setState({
        showReactionOptions: false
      });
    }

    sendReact = (name) => {
      if(this.state.react == name){
        name = ""
      }
      this.setState({
        react: name
      })
    }

    render() {
        const { position, containerStyle, wrapperStyle, bottomContainerStyle, } = this.props;
        return (<View><View style={[
            styles[position].container,
            containerStyle && containerStyle[position],
        ]}
        onLayout={(event) => {
          var {width, height} = event.nativeEvent.layout;
          this.setState({width, height})}}>
        <View style={[
            styles[position].wrapper,
            wrapperStyle && wrapperStyle[position],
            this.styledBubbleToNext(),
            this.styledBubbleToPrevious(),
        ]}>
          <TouchableWithoutFeedback delayLongPress={120} onLongPress={() => this.openReactionMenu()} accessibilityTraits='text' {...this.props.touchableProps}>
            <View>
              {this.renderBubbleContent()}
              <View style={[
            styles[position].bottom,
            bottomContainerStyle && bottomContainerStyle[position],
        ]}>
                {this.renderUsername()}
                {this.renderTime()}
                {this.renderTicks()}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {(this.props.position == "left" && this.state.showReactionOptions && Platform.OS == "ios")?
          <View style={{height: 40, position: "absolute", width: 220, backgroundColor: "#fff", right: (this.state.width + 220 > screenWidth)?-40:(this.state.width - 220 < 0)?-150:-80, top: -35, borderRadius: 20, shadowColor: '#000',
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 2}}>
            <View style={{height: '100%', width: '100%', flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReact("love")} style={{margin: 5}}><Love style={{height: 30, width: 30}} /></TouchableOpacity>
              <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReact("haha")} style={{margin: 5}}><Haha style={{height: 30, width: 30}} /></TouchableOpacity>
              <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReact("sad")} style={{margin: 5}}><Sad style={{height: 30, width: 30}} /></TouchableOpacity>
              <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReact("wow")} style={{margin: 5}}><Wow style={{height: 30, width: 30}} /></TouchableOpacity>
              <TouchableOpacity activeOpacity={0.4} onPress={() => this.sendReact("angry")} style={{margin: 5}}><Angry style={{height: 30, width: 30}} /></TouchableOpacity>
            </View>
          </View>
          :<View></View>}
          {(this.props.position == "left" && this.state.react != "")?
          <View style={{height: 15, width: 15, position: "absolute", right: -5, bottom: 0, borderRadius: 20, shadowColor: '#000',
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 2}}>
            <View style={{height: '100%', width: '100%', flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            {
              (this.state.react == "love")?
              <Love style={{height: 20, width: 20}} />
              :
              (this.state.react == "haha")?
              <Haha style={{height: 20, width: 20}} />
              :
              (this.state.react == "sad")?
              <Sad style={{height: 20, width: 20}} />
              :
              (this.state.react == "wow")?
              <Wow style={{height: 20, width: 20}} />
              :
              (this.state.react == "angry")?
              <Angry style={{height: 20, width: 20}} />
              :
              <View></View>
            }
          </View>
          </View>
          :<View></View>}
          {(this.props.position == "right" && this.state.react != "")?
          <View style={{height: 15, width: 15, position: "absolute", left: -5, bottom: 0, borderRadius: 20, shadowColor: '#000',
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 2}}>
            <View style={{height: '100%', width: '100%', flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            {
              (this.state.react == "love")?
              <Love style={{height: 20, width: 20}} />
              :
              (this.state.react == "haha")?
              <Haha style={{height: 20, width: 20}} />
              :
              (this.state.react == "sad")?
              <Sad style={{height: 20, width: 20}} />
              :
              (this.state.react == "wow")?
              <Wow style={{height: 20, width: 20}} />
              :
              (this.state.react == "angry")?
              <Angry style={{height: 20, width: 20}} />
              :
              <View></View>
            }
          </View>
          </View>
          :<View></View>}
          {(this.props.position == "left" && this.state.react == "" && this.props.allowReactions)?
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.openReactionMenu()} style={{height: 18, position: "absolute", width: 18, backgroundColor: "#f2f2f2", right: -5, bottom: 0, borderRadius: 9, shadowColor: '#000',
          shadowOffset: { width: 0.5, height: 0.5 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 2, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 15, color: "#a8a8a8"}}>+</Text>
          </TouchableOpacity>
          :<View></View>}
        </View>
        {this.renderQuickReplies()}
      </View>
      </View>);
    }
}
Bubble.contextTypes = {
    actionSheet: PropTypes.func,
};
Bubble.defaultProps = {
    touchableProps: {},
    onLongPress: null,
    renderMessageImage: null,
    renderMessageVideo: null,
    renderMessageText: null,
    renderCustomView: null,
    renderUsername: null,
    renderTicks: null,
    renderTime: null,
    renderQuickReplies: null,
    onQuickReply: null,
    position: 'left',
    optionTitles: DEFAULT_OPTION_TITLES,
    currentMessage: {
        text: null,
        createdAt: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    bottomContainerStyle: {},
    tickStyle: {},
    usernameStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
};
Bubble.propTypes = {
    user: PropTypes.object.isRequired,
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageVideo: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    isCustomViewBottom: PropTypes.bool,
    renderUsernameOnMessage: PropTypes.bool,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    renderQuickReplies: PropTypes.func,
    onQuickReply: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    wrapperStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    bottomContainerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    tickStyle: PropTypes.any,
    usernameStyle: PropTypes.any,
    containerToNextStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
};
//# sourceMappingURL=Bubble.js.map
