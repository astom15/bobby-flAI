import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { Chat, ChatContextType } from "../types/chats";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const setCurrentChat = useCallback((chat: Chat | null) => {
    setCurrentChatState(chat);
  }, []);
  const value = useMemo(
    () => ({ currentChat, setCurrentChat }),
    [currentChat, setCurrentChat],
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChatContext must be used within a ChatProvider");
  return context;
};