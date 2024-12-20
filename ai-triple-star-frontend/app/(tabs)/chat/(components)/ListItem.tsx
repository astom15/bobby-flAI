// import { Chat } from "@/app/types/chats";
// import React from "react";
// import {
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   Text,
//   ViewToken,
// } from "react-native";
// import Animated, {
//   useAnimatedStyle,
//   withTiming,
//   SharedValue,
//   withSpring,
// } from "react-native-reanimated";

// type ListItemProps = {
//   viewableItems: SharedValue<ViewToken[]>;
//   item: Chat;
//   onSelect: (chat: Chat) => void;
// };
// const ListItem: React.FC<ListItemProps> = React.memo(
//   ({ item, viewableItems, onSelect }) => {
//     const animatedStyle = useAnimatedStyle(() => {
//       const isVisible = viewableItems.value.some(
//         (viewToken) => viewToken.item.id === item.id,
//       );
//       console.log(item);
//       return {
//         opacity: withSpring(isVisible ? 1 : 0.5), // Smooth fade in/out
//         transform: [{ scale: withSpring(isVisible ? 1 : 0.9) }], // Smooth scale animation
//       };
//     });
//     return (
//       <Animated.View style={[animatedStyle, styles.chatItem]}>
//         <TouchableOpacity onPress={() => onSelect(item)}>
//           <Text>{item.name}</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   },
// );
// ListItem.displayName = "ListItem";

// export { ListItem };
// const styles = StyleSheet.create({
//   chatItem: {
//     fontSize: 18,
//     paddingVertical: 5,
//     paddingLeft: 0,
//     paddingRight: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
// });
