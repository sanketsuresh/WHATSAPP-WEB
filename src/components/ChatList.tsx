import React from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { Conversation } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  conversations: Conversation[];
  onConversationSelect: (conversation: Conversation) => void;
  activeConversation: Conversation | null;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onConversationSelect,
  activeConversation
}) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatTime = (date: Date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // Less than a week
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-semibold text-gray-900">Chats</h1>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No conversations yet</p>
            <p className="text-sm">Start a conversation to see it here</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.wa_id}
              onClick={() => onConversationSelect(conversation)}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                activeConversation?.wa_id === conversation.wa_id ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full ${getAvatarColor(conversation.contactName)} flex items-center justify-center text-white font-semibold mr-3`}>
                {conversation.contactName.charAt(0).toUpperCase()}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.contactName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-green-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-medium">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center mt-1">
                    <div className="mr-1">
                      {conversation.lastMessageStatus === 'sent' && (
                        <span className="text-gray-400">✓</span>
                      )}
                      {conversation.lastMessageStatus === 'delivered' && (
                        <span className="text-gray-400">✓✓</span>
                      )}
                      {conversation.lastMessageStatus === 'read' && (
                        <span className="text-blue-500">✓✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;