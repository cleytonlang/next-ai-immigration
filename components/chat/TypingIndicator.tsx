export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}