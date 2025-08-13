import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { Conversation, Message } from '../types';
import { sendMessage } from '../services/api';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onNewMessage: (message: Message) => void;
  onBack: () => void;
  showBackButton: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6002';
let socket: Socket | null = null;

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onNewMessage,
  onBack,
  showBackButton
}) => {
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!conversation?.wa_id) return;

    // Set up socket connection if it doesn't exist
    if (!socket) {
      socket = io(API_BASE, { transports: ['websocket'] });
    }

    // Handler for new messages
    const handleNewMessage = (msg: Message) => {
      if (msg.wa_id === conversation.wa_id) {
        onNewMessage(msg);
      }
    };

    // Join room and listen for messages
    socket.emit('join-conversation', conversation.wa_id);
    socket.on('new-message', handleNewMessage);

    // Cleanup on component unmount or conversation change
    return () => {
      socket?.off('new-message', handleNewMessage);
    };
  }, [conversation.wa_id, onNewMessage]);

  

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    const text = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      // Immediately add optimistic message to UI
      const optimisticMessage: Message = {
        _id: new Date().toISOString(), // Temporary ID
        messageId: `temp-${new Date().toISOString()}`,
        wa_id: conversation.wa_id,
        contactName: conversation.contactName,
        content: text,
        direction: 'outgoing',
        status: 'sent',
        timestamp: new Date(),
        type: 'text'
      };
      onNewMessage(optimisticMessage);

      // Send to server
      await sendMessage(conversation.wa_id, text, conversation.contactName);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      // TODO: Handle message failure UI
      setInputValue(text); // Restore input on failure
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatPhoneNumber = (wa_id: string) => {
    return wa_id.startsWith('91')
      ? `+${wa_id.slice(0, 2)} ${wa_id.slice(2, 7)} ${wa_id.slice(7)}`
      : `+${wa_id}`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className={`w-10 h-10 rounded-full ${getAvatarColor(conversation.contactName)} flex items-center justify-center text-white font-semibold`}>
            {conversation.contactName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-gray-900 truncate">{conversation.contactName}</h2>
            <p className="text-xs text-gray-600">{formatPhoneNumber(conversation.wa_id)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full"><Phone className="w-5 h-5 text-gray-600" /></button>
          <button className="p-2 hover:bg-gray-200 rounded-full"><Video className="w-5 h-5 text-gray-600" /></button>
          <button className="p-2 hover:bg-gray-200 rounded-full"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                💬
              </div>
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation with {conversation.contactName}</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble key={msg._id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1 bg-white rounded-lg border border-gray-200">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-transparent border-none outline-none"
              disabled={sending}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || sending}
            className={`p-3 rounded-full ${
              inputValue.trim() && !sending
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
