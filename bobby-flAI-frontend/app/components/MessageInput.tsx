import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
// eslint-disable-next-line import/no-unresolved
import Colors from "@/app/utils/Colors";
import { MessageInputProps } from "../types/messages";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const MessageInput = ({ onShouldSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState(" ");
  // might be necessary? its on top of the tabs so i dont think it will be
  // const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);

  const onSend = (message: string) => {
    onShouldSendMessage(message);
    setMessage("");
  };
  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const expandedButtonStyle = useAnimatedStyle(() => {
    const opacityInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const widthInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [30, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacityInterpolation,
      width: widthInterpolation,
    };
  });

  const buttonViewStyle = useAnimatedStyle(() => {
    const widthInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [0, 100],
      Extrapolation.CLAMP,
    );
    return {
      opacity: expanded.value,
      width: widthInterpolation,
    };
  });

  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 });
  };
  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };

  return (
    <BlurView
      intensity={70}
      tint="extraLight"
      style={{ paddingBottom: 10, paddingTop: 10 }}
    >
      <View style={styles.row}>
        <AnimatedTouchableOpacity
          onPress={expandItems}
          style={[styles.roundButton, expandedButtonStyle]}
        >
          <Ionicons name="add" size={24} colors={Colors.grey}></Ionicons>
        </AnimatedTouchableOpacity>
        <Animated.View style={[styles.buttonView, buttonViewStyle]}>
          <TouchableOpacity onPress={() => ImagePicker.launchCameraAsync()}>
            <Ionicons
              name="camera-outline"
              size={24}
              colors={Colors.grey}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => ImagePicker.launchImageLibraryAsync()}
          >
            <Ionicons
              name="image-outline"
              size={24}
              colors={Colors.grey}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => DocumentPicker.getDocumentAsync()}>
            <Ionicons
              name="folder-outline"
              size={24}
              colors={Colors.grey}
            ></Ionicons>
          </TouchableOpacity>
        </Animated.View>
        <TextInput
          autoFocus
          ref={inputRef}
          placeholder="Message"
          style={styles.messageInput}
          multiline
          value={message}
          onFocus={collapseItems}
          onChangeText={onChangeText}
        />
        {message.length > 0 ? (
          <TouchableOpacity onPress={() => onSend(message)}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={24}
              color={Colors.grey}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <FontAwesome5 name="headphones" size={24} color={Colors.grey} />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    flex: 1,
  },
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  roundButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.input,
    alignItems: "center",
    justifyContent: "center",
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 10,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.light,
  },
});

export default MessageInput;
