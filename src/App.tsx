import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import { Conversation, Message } from './types';
import { fetchConversations, fetchMessages } from './services/api';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:9000', {
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
    });

    newSocket.on('new-message', (message: Message) => {
      console.log('📨 New message received:', message);
      loadConversations(); // Always refresh conversations
      
      // Update messages only if it's for the active conversation
      if (activeConversation?.wa_id === message.wa_id) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('message-status-update', ({ messageId, status }) => {
      console.log('📊 Message status update:', messageId, status);
      
      setMessages(prev => prev.map(msg => 
        msg.messageId === messageId ? { ...msg, status } : msg
      ));
    });

    setSocket(newSocket);
    
    // Load initial data
    loadConversations();

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      newSocket.close();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.wa_id);
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (wa_id: string) => {
    try {
      const data = await fetchMessages(wa_id);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleBackToList = () => {
    setActiveConversation(null);
  };

  const handleNewMessage = (message: Message) => {
    // Add new message to state
    setMessages(prev => [...prev, message]);
    
    // Refresh conversation list to show new last message
    loadConversations();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WhatsApp Web...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <div className="h-full flex">
        {/* Chat List - Hidden on mobile when conversation is active */}
        <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 ${
          isMobile && activeConversation ? 'hidden' : 'block'
        }`}>
          <ChatList 
            conversations={conversations}
            onConversationSelect={handleConversationSelect}
            activeConversation={activeConversation}
          />
        </div>

        {/* Chat Window */}
        <div className={`w-full md:w-2/3 lg:w-3/4 bg-gray-50 ${
          isMobile && !activeConversation ? 'hidden' : 'block'
        }`}>
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              onNewMessage={handleNewMessage}
              onBack={handleBackToList}
              showBackButton={isMobile}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500 max-w-md px-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.37L1 23l6.63-2.05c1.33.69 2.83 1.05 4.37 1.05 5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-1.45 0-2.87-.38-4.13-1.1L3.5 19.5l.67-3.37C3.38 14.87 3 13.45 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">WhatsApp Web</h2>
                <p className="text-gray-600">
                  Select a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;