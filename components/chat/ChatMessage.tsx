import { ChatMessageProps } from '@/types/chat';

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.sender === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}