export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ChatSession {
  assistantId: string;
  messages: Message[];
  threadId: string | null;
}

export interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export interface ChatMessageProps {
  message: Message;
}

export interface ChatContainerProps {
  messages: Message[];
  isTyping?: boolean;
  selectedAssistant?: Assistant;
}

export interface SidebarProps {
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  onSelectAssistant: (assistant: Assistant) => void;
  isLoading?: boolean;
  error?: string;
}