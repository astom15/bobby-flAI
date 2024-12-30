import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Message, Role } from "../types/messages";

const ChatMessage = ({ content, role, imageUrl }: Message) => {
  return (
    <View style={styles.row}>
      {role === Role.bot ? (
        <View style={[styles.item]}>
          <Image
            source={require("../../assets/images/react-logo.png")}
            style={styles.avatar}
          />
        </View>
      ) : (
        <Image
          source={require("../../assets/images/gigachad.png")}
          style={styles.avatar}
        />
      )}
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    gap: 7,
    marginVertical: 12,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: "wrap",
    flex: 1,
  },
});

export default ChatMessage;
