import { View, Text, StyleSheet, Pressable } from "react-native";
import PreviousChatsModal from "./(components)/PreviousChats";
import React, { useState } from "react";
import { Chat } from "../../types/chats";

const previousChats: Chat[] = [
  { id: "1", name: "What can I make with cheese and eggs" },
  { id: "2", name: "What's a good gnocchi recipe" },
  { id: "3", name: "Burger King at home" },
];

const ChatBot = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {currentChat ? (
        <>
          <Text style={styles.header}>{currentChat.name} </Text>
          <Pressable
            style={styles.chatButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Chats</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.header}>Let's Start Cooking</Text>
        </>
      )}
      <PreviousChatsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        chats={previousChats}
        onSelect={handleChatSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chatButton: {
    backgroundColor: "white",
  },
  buttonText: {
    color: "black",
    textAlign: "center",
  },
});

export default ChatBot;
