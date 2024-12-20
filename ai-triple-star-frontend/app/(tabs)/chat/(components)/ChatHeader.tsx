import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface ChatHeaderProps {
  navigation: any;
  onOpenModal: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ navigation, onOpenModal }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.previousChatsButton} onPress={onOpenModal}>
        <Text style={styles.previousChatsButtonText}>Chats</Text>
      </Pressable>
      <Text style={styles.title}>Cook 0.1</Text>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          navigation.navigate("chat", { isNewChat: true });
        }}
      >
        <Text style={styles.actionButtonText}>New Chat</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  previousChatsButton: {
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  previousChatsButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: "f8f8f8",
  },
  actionButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ChatHeader;
