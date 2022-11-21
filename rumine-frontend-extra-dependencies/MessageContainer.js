/** This goes in react-native-gifted-chat **/
import PropTypes from 'prop-types';
import React from 'react';
import { FlatList, View, StyleSheet, Keyboard, TouchableOpacity, Text, } from 'react-native';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import Color from './Color';
import { warning } from './utils';

let renderingAlready = false;

let messageFilter = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAlignTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    contentContainerStyle: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    headerWrapper: {
        flex: 1,
    },
    listStyle: {
        flex: 1,
    },
    scrollToBottomStyle: {
        opacity: 0.8,
        position: 'absolute',
        right: 10,
        bottom: 30,
        zIndex: 999,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Color.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Color.black,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
    },
});
export default class MessageContainer extends React.PureComponent {

    constructor() {
        super(...arguments);
        this.state = {
            showScrollBottom: false,
        };
        this.attachKeyboardListeners = () => {
            const { invertibleScrollViewProps: invertibleProps } = this.props;
            if (invertibleProps) {
                Keyboard.addListener('keyboardWillShow', invertibleProps.onKeyboardWillShow);
                Keyboard.addListener('keyboardDidShow', invertibleProps.onKeyboardDidShow);
                Keyboard.addListener('keyboardWillHide', invertibleProps.onKeyboardWillHide);
                Keyboard.addListener('keyboardDidHide', invertibleProps.onKeyboardDidHide);
            }
        };
        this.detachKeyboardListeners = () => {
            const { invertibleScrollViewProps: invertibleProps } = this.props;
            Keyboard.removeListener('keyboardWillShow', invertibleProps.onKeyboardWillShow);
            Keyboard.removeListener('keyboardDidShow', invertibleProps.onKeyboardDidShow);
            Keyboard.removeListener('keyboardWillHide', invertibleProps.onKeyboardWillHide);
            Keyboard.removeListener('keyboardDidHide', invertibleProps.onKeyboardDidHide);
        };
        this.renderFooter = () => {
            if (this.props.renderFooter) {
                const footerProps = {
                    ...this.props,
                };
                return this.props.renderFooter(footerProps);
            }
            return null;
        };
        this.renderLoadEarlier = () => {
            if (this.props.loadEarlier === true) {
                const loadEarlierProps = {
                    ...this.props,
                };
                if (this.props.renderLoadEarlier) {
                    return this.props.renderLoadEarlier(loadEarlierProps);
                }
                return <LoadEarlier {...loadEarlierProps}/>;
            }
            return null;
        };
        this.scrollToBottom = (animated = true) => {
            const { inverted } = this.props;
            if (inverted) {
                this.scrollTo({ offset: 0, animated });
            }
            else {
                this.props.forwardRef.current.scrollToEnd({ animated });
            }
        };
        this.handleOnScroll = (event) => {
            const { nativeEvent: { contentOffset: { y: contentOffsetY }, contentSize: { height: contentSizeHeight }, layoutMeasurement: { height: layoutMeasurementHeight }, }, } = event;
            const { scrollToBottomOffset } = this.props;
            if (this.props.inverted) {
                if (contentOffsetY > scrollToBottomOffset) {
                    this.setState({ showScrollBottom: true });
                }
                else {
                    this.setState({ showScrollBottom: false });
                }
            }
            else {
                if (contentOffsetY < scrollToBottomOffset &&
                    contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset) {
                    this.setState({ showScrollBottom: true });
                }
                else {
                    this.setState({ showScrollBottom: false });
                }
            }
        };
        this.renderRow = ({ item, index }) => {
            if (!item._id && item._id !== 0) {
                warning('GiftedChat: `_id` is missing for message', JSON.stringify(item));
            }
            if (!item.user) {
                if (!item.system) {
                    warning('GiftedChat: `user` is missing for message', JSON.stringify(item));
                }
                item.user = { _id: 0 };
            }
            const { messages, user, inverted, ...restProps } = this.props;
            if (messages && user) {
                const previousMessage = (inverted ? messages[index + 1] : messages[index - 1]) || {};
                const nextMessage = (inverted ? messages[index - 1] : messages[index + 1]) || {};
                const messageProps = {
                    ...restProps,
                    user,
                    key: item._createdAt + item._id,
                    currentMessage: item,
                    previousMessage,
                    inverted,
                    nextMessage,
                    position: item.user._id === user._id ? 'right' : 'left',
                };
                if (this.props.renderMessage) {
                    return this.props.renderMessage(messageProps);
                }
                return <Message {...messageProps}/>;
            }
            return null;
        };
        this.renderChatEmpty = () => {
            if (this.props.renderChatEmpty) {
                return this.props.renderChatEmpty();
            }
            return <View style={styles.container}/>;
        };
        this.renderHeaderWrapper = () => (<View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>);
        this.onLayoutList = () => {
            if (!this.props.inverted &&
                !!this.props.messages &&
                this.props.messages.length) {
                setTimeout(() => this.scrollToBottom && this.scrollToBottom(false), 15 * this.props.messages.length);
            }
        };
        this.keyExtractor = (item) => `${item._id}`;
    }
    componentDidMount() {
        if (this.props.messages && this.props.messages.length === 0) {
            this.attachKeyboardListeners();
        }
    }
    componentWillUnmount() {
        this.detachKeyboardListeners();
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.messages != this.props.messages){
        messageFilter = {};
        return true;
      }
      return false;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.messages &&
            prevProps.messages.length === 0 &&
            this.props.messages &&
            this.props.messages.length > 0) {
            this.detachKeyboardListeners();
        }
        else if (prevProps.messages &&
            this.props.messages &&
            prevProps.messages.length > 0 &&
            this.props.messages.length === 0) {
            this.attachKeyboardListeners();
        }
    }
    scrollTo(options) {
        if (this.props.forwardRef && this.props.forwardRef.current && options) {
            this.props.forwardRef.current.scrollToOffset(options);
        }
    }
    renderScrollBottomComponent() {
        const { scrollToBottomComponent } = this.props;
        if (scrollToBottomComponent) {
            return scrollToBottomComponent();
        }
        return <Text>V</Text>;
    }
    renderScrollToBottomWrapper() {
        const propsStyle = this.props.scrollToBottomStyle || {};
        return (<View style={[styles.scrollToBottomStyle, propsStyle]}>
        <TouchableOpacity onPress={() => this.scrollToBottom()} hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}>
          {this.renderScrollBottomComponent()}
        </TouchableOpacity>
      </View>);
    }
    render() {
        const { inverted } = this.props;
        return (<View onStartShouldSetResponder={() => true} style={[this.props.alignTop ? styles.containerAlignTop : styles.container, {paddingTop: 50}]}>
        {this.state.showScrollBottom && this.props.scrollToBottom
            ? this.renderScrollToBottomWrapper()
            : null}
        <FlatList scrollEnabled={this.props.scrollEnabled} CellRendererComponent={({ children, index, style, ...props }) => {
        const cellStyle = [
            style,
            // I want each item to have a higher zIndex than the previous one,
            // in reversed order due to the FlatList being inverted
            { zIndex: this.props.messages.length - index,
              elevation: this.props.messages.length - index}
        ]

        // OverflowableView for Android...
        return (
            <View style={cellStyle} index={index} {...props}>
                {children}
            </View>
        )
    }} ref={this.props.forwardRef} extraData={this.props.extraData} keyExtractor={this.keyExtractor} enableEmptySections automaticallyAdjustContentInsets={false} inverted={inverted} data={this.props.messages} style={styles.listStyle} contentContainerStyle={styles.contentContainerStyle} renderItem={this.renderRow} {...this.props.invertibleScrollViewProps} ListEmptyComponent={this.renderChatEmpty} ListFooterComponent={inverted ? this.renderHeaderWrapper : this.renderFooter} ListHeaderComponent={inverted ? this.renderFooter : this.renderHeaderWrapper} onScroll={this.handleOnScroll} scrollEventThrottle={100} onLayout={this.onLayoutList} {...this.props.listViewProps}/>
      </View>);
    }
}
MessageContainer.defaultProps = {
    messages: [],
    user: {},
    renderChatEmpty: null,
    renderFooter: null,
    renderMessage: null,
    onLoadEarlier: () => { },
    onQuickReply: () => { },
    inverted: true,
    loadEarlier: false,
    listViewProps: {},
    invertibleScrollViewProps: {},
    extraData: null,
    scrollToBottom: false,
    scrollToBottomOffset: 200,
    alignTop: false,
    scrollToBottomStyle: {},
};
MessageContainer.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
    renderChatEmpty: PropTypes.func,
    renderFooter: PropTypes.func,
    renderMessage: PropTypes.func,
    renderLoadEarlier: PropTypes.func,
    onLoadEarlier: PropTypes.func,
    listViewProps: PropTypes.object,
    inverted: PropTypes.bool,
    loadEarlier: PropTypes.bool,
    invertibleScrollViewProps: PropTypes.object,
    extraData: PropTypes.object,
    scrollToBottom: PropTypes.bool,
    scrollToBottomOffset: PropTypes.number,
    scrollToBottomComponent: PropTypes.func,
    alignTop: PropTypes.bool,
};
//# sourceMappingURL=MessageContainer.js.map
