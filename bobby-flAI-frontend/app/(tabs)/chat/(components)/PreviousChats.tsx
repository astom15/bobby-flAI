import React, { useEffect, useState } from "react";
import { Chat, PreviousChatsModalProps } from "../../../types/chats";
import { View, StyleSheet, Modal, FlatList, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import ChatSearchBar from "./ChatSearchBar";
import { ListItem } from "./ListItem";

const { width } = Dimensions.get("window");

const PreviousChatsModal = ({
  isVisible,
  onClose,
  chats,
  onSelect,
}: PreviousChatsModalProps) => {
  const [isScrollBarVisible, setIsScrollBarVisible] = useState(false);
  const translateX = useSharedValue(isVisible ? 0 : -width);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    if (isVisible) {
      translateX.value = withTiming(0, { duration: 500 }, () =>
        setIsScrollBarVisible(true),
      );
    }
  }, [isVisible, translateX]);

  const handleSelect = (item?: Chat) => {
    setIsScrollBarVisible(false);
    translateX.value = withTiming(-width, { duration: 500 }, () => {
      onClose();
      if (item) onSelect(item);
    });
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={() => handleSelect}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.viewContent, animatedStyle]}>
          <ChatSearchBar />
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListItem item={item} onSelect={() => handleSelect(item)} />
            )}
            contentContainerStyle={styles.listContent}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={isScrollBarVisible}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
  },
  viewContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chatItem: {
    fontSize: 18,
    paddingVertical: 5,
    paddingLeft: 0,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  listContent: {
    padding: 10,
  },
});

export default PreviousChatsModal;
