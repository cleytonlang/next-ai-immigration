import { SidebarProps } from '@/types/chat';

export default function Sidebar({ assistants, selectedAssistant, onSelectAssistant, isLoading, error }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Assistentes</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Carregando assistentes...</div>
            </div>
          ) : error ? (
            <div className="p-3 text-red-400 text-sm">
              <div className="font-medium mb-1">Erro ao carregar</div>
              <div className="text-xs">{error}</div>
            </div>
          ) : assistants.length === 0 ? (
            <div className="p-3 text-gray-400 text-sm">
              Nenhum assistente encontrado
            </div>
          ) : (
            assistants.map((assistant) => (
              <button
                key={assistant.id}
                onClick={() => onSelectAssistant(assistant)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors hover:bg-gray-700 ${
                  selectedAssistant?.id === assistant.id 
                    ? 'bg-gray-700 border border-gray-600' 
                    : 'bg-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{assistant.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {assistant.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {assistant.description}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {selectedAssistant ? `Conversando com ${selectedAssistant.name}` : 'Selecione um assistente'}
        </div>
      </div>
    </div>
  );
}