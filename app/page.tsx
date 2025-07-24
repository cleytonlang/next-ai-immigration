'use client';

import { useState, useEffect } from 'react';
import { Message, Assistant, ChatSession } from '@/types/chat';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantsLoading, setAssistantsLoading] = useState(true);
  const [assistantsError, setAssistantsError] = useState<string>('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({});
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setAssistantsLoading(true);
        setAssistantsError('');
        
        const response = await fetch('/api/assistants');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch assistants');
        }

        setAssistants(data.assistants);
      } catch (error) {
        console.error('Error fetching assistants:', error);
        setAssistantsError(error instanceof Error ? error.message : 'Erro ao carregar assistentes');
      } finally {
        setAssistantsLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  const getCurrentSession = () => {
    if (!selectedAssistant) return null;
    return chatSessions[selectedAssistant.id] || null;
  };

  const getCurrentMessages = () => {
    const session = getCurrentSession();
    return session?.messages || [];
  };

  const handleSelectAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    
    if (!chatSessions[assistant.id]) {
      setChatSessions(prev => ({
        ...prev,
        [assistant.id]: {
          assistantId: assistant.id,
          messages: [],
          threadId: null
        }
      }));
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isLoading || !selectedAssistant) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    const currentSession = getCurrentSession();
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    setChatSessions(prev => ({
      ...prev,
      [selectedAssistant.id]: {
        ...prev[selectedAssistant.id],
        messages: [...(prev[selectedAssistant.id]?.messages || []), userMessage]
      }
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          threadId: currentSession?.threadId,
          assistantId: selectedAssistant.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'ai',
        timestamp: new Date(),
      };

      setChatSessions(prev => ({
        ...prev,
        [selectedAssistant.id]: {
          ...prev[selectedAssistant.id],
          messages: [...prev[selectedAssistant.id].messages, aiResponse],
          threadId: data.threadId || prev[selectedAssistant.id].threadId
        }
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `Erro: ${error instanceof Error ? error.message : 'Falha na comunicação com o assistente'}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setChatSessions(prev => ({
        ...prev,
        [selectedAssistant.id]: {
          ...prev[selectedAssistant.id],
          messages: [...prev[selectedAssistant.id].messages, errorMessage]
        }
      }));
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        assistants={assistants}
        selectedAssistant={selectedAssistant}
        onSelectAssistant={handleSelectAssistant}
        isLoading={assistantsLoading}
        error={assistantsError}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <h1 className="text-xl font-semibold">
            {selectedAssistant ? `${selectedAssistant.name}` : 'AI Immigration Chat'}
          </h1>
        </header>

        <ChatContainer 
          messages={getCurrentMessages()} 
          isTyping={isTyping} 
          selectedAssistant={selectedAssistant}
        />

        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSendMessage}
          isLoading={isLoading || !selectedAssistant}
        />
      </div>
    </div>
  );
}
