import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import PreviousChatsModal from "./(components)/PreviousChats";
import React, { useEffect, useState } from "react";
import { Chat } from "../../types/chats";
import { useLocalSearchParams } from "expo-router";
// eslint-disable-next-line import/no-unresolved
import MessageInput from "@/app/components/MessageInput";
// eslint-disable-next-line import/no-unresolved
import { defaultStyles } from "@/app/utils/Styles";

const previousChats: Chat[] = [
  { id: "1", name: "What can I make with cheese and eggs" },
  { id: "2", name: "What's a good gnocchi recipe" },
  { id: "3", name: "Burger King at home" },
];

const ChatBot = () => {
  const { isNewChat } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  useEffect(() => {
    if (isNewChat) {
      setCurrentChat(null);
    }
  }, [isNewChat]);

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    setModalVisible(false);
  };

  const getCompleteMessage = async (message: string) => {
    console.log("get message: ", message);
  };
  return (
    <View style={[defaultStyles.pageContainer, { backgroundColor: "red" }]}>
      <PreviousChatsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        chats={previousChats}
        onSelect={handleChatSelect}
      />
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
      <KeyboardAvoidingView
        style={[styles.keyboardStyle]}
        keyboardVerticalOffset={60}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <MessageInput onShouldSendMessage={getCompleteMessage} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  keyboardStyle: {
    position: "absolute",
    width: "100%",
    left: 0,
    bottom: 0,
    //flexShrink: 0,
  },
});

export default ChatBot;
