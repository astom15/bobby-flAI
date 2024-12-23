// eslint-disable-next-line import/no-unresolved
import { Chat } from "@/app/types/chats";
import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

type ListItemProps = {
  item: Chat;
  onSelect: (chat: Chat) => void;
};
const ListItem: React.FC<ListItemProps> = React.memo(({ item, onSelect }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSelect(item)}>
        <Text style={styles.chatItem}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );
});
ListItem.displayName = "ListItem";

export { ListItem };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
  },
  chatItem: {
    fontSize: 18,
    paddingVertical: 5,
    paddingLeft: 0,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
