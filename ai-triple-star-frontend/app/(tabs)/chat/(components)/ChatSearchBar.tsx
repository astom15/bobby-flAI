import Colors from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";

const ChatSearchBar = () => {
  return (
    <View style={styles.SearchSection}>
      <Ionicons
        style={styles.SearchIcon}
        name="search"
        size={20}
        color={Colors.grey}
      />
      <TextInput
        style={[styles.input]}
        placeholder="Search"
        underlineColorAndroid={"transparent"}
        selectionColor={"transparent"}
      />
    </View>
  );
};

export default ChatSearchBar;

const styles = StyleSheet.create({
  SearchSection: {
    marginRight: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.pink,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    borderRadius: 10,
    height: 34,
    paddingHorizontal: 8,
  },
  SearchIcon: {
    paddingRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 5,
    alignItems: "center",
    color: "#424242",
    ...Platform.select({
      android: {
        underlineColorAndroid: "transparent",
      },
      ios: {
        borderWidth: 0,
      },
      web: {
        outlineStyle: "none",
      },
    }),
  },
});
