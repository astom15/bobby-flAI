export interface Chat {
  id: string;
  name: string;
}

export interface PreviousChatsModalProps {
  isVisible: boolean;
  onClose: () => void;
  chats: Chat[];
  onSelect: (chat: Chat) => void;
}

export interface ChatContextType {
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
}
