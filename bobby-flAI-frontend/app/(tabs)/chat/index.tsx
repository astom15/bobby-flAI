import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PreviousChatsModal from "./(components)/PreviousChats";
import React, { useEffect, useState } from "react";
import { Chat } from "../../types/chats";
import { useLocalSearchParams } from "expo-router";
// eslint-disable-next-line import/no-unresolved
import MessageInput from "@/app/components/MessageInput";
// eslint-disable-next-line import/no-unresolved
import { defaultStyles } from "@/app/utils/Styles";
// eslint-disable-next-line import/no-unresolved
import { Message, Role } from "@/app/types/messages";
import { FlashList } from "@shopify/flash-list";
// eslint-disable-next-line import/no-unresolved
import ChatMessage from "@/app/components/ChatMessage";

const previousChats: Chat[] = [
  { id: "1", name: "What can I make with cheese and eggs" },
  { id: "2", name: "What's a good gnocchi recipe" },
  { id: "3", name: "Burger King at home" },
];
const DUMMY_MESSAGES: Message[] = [
  {
    role: Role.bot,
    content: "hello, how can i help you today",
  },
  {
    role: Role.user,
    content: "I need help with my cooking assistant app",
  },
  {
    role: Role.bot,
    content: "Sure, how can i help you",
  },
  {
    role: Role.user,
    content: "I need to cook something with these ingredients",
  },
];
const ChatBot = () => {
  const { isNewChat } = useLocalSearchParams();
  const [height, setHeight] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, getMessages] = useState<Message[]>(DUMMY_MESSAGES);

  useEffect(() => {
    if (isNewChat) {
      setCurrentChat(null);
    }
  }, [isNewChat]);

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    setModalVisible(false);
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height / 2);
  };

  const getCompleteMessage = async (message: string) => {
    console.log("get message: ", message);
  };
  return (
    <View style={[defaultStyles.pageContainer]}>
      <PreviousChatsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        chats={previousChats}
        onSelect={handleChatSelect}
      />
      <View style={styles.page} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image
              source={require("../../../assets/images/react-logo.png")}
              style={styles.image}
            />
          </View>
        )}
        <FlashList
          data={messages}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => <ChatMessage {...item} />}
        />
      </View>

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
  image: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 50,
  },
  page: {
    flex: 1,
    backgroundColor: "red",
  },
});

export default ChatBot;
