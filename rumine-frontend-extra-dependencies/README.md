# rumine-fe-dependencies
Extra dependencies that must replace existing files in node_module packages.

Bubble.js => react-native-gifted-chat

MessageContainer.js => react-native-gifted-chat

GiftedChat.js => react-native-gifted-chat

Avatar.js => react-native-gifted-chat

MessageText.js => react-native-gifted-chat

SwipeCard.js => react-native-swipe-cards

Switch.js => react-native-switch

datepicker.js => react-native-datepicker

react-native-datepicker also requires:

  if (@available(iOS 14, *)) {
    UIDatePicker *picker = [UIDatePicker appearance];
    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
  }
  
 Placed in AppDelegate.m in didFinishLaunchingWithOptions

