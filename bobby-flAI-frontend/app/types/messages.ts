export interface MessageInputProps {
  onShouldSendMessage: (message: string) => void;
}

export enum Role {
  user = 1,
  bot = 0,
}

export interface Message {
  role: Role;
  content: string;
  imageUrl?: string;
  prompt?: string;
}
