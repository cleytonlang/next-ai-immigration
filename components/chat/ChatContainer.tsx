import { ChatContainerProps } from '@/types/chat';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export default function ChatContainer({ messages, isTyping = false, selectedAssistant }: ChatContainerProps) {
  const getWelcomeMessage = () => {
    if (!selectedAssistant) {
      return {
        title: "Selecione um Assistente",
        subtitle: "Escolha um assistente no menu lateral para começar"
      };
    }
    
    return {
      title: `Olá! Sou ${selectedAssistant.name}`,
      subtitle: selectedAssistant.description
    };
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isTyping ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            {selectedAssistant && (
              <div className="text-6xl mb-4">{selectedAssistant.icon}</div>
            )}
            <h2 className="text-2xl font-medium mb-2">{welcome.title}</h2>
            <p>{welcome.subtitle}</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </>
      )}
    </div>
  );
}