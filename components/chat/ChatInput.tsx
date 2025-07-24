import { ChatInputProps } from '@/types/chat';

export default function ChatInput({ 
  inputText, 
  setInputText, 
  onSendMessage, 
  isLoading 
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex space-x-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={1}
          style={{ minHeight: '44px', maxHeight: '120px' }}
          disabled={isLoading}
        />
        <button
          onClick={onSendMessage}
          disabled={inputText.trim() === '' || isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}