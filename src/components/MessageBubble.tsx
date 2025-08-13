import React from 'react';
import { Message } from '../types';
import { format, isToday, isYesterday } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

const formatTime = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutgoing = message.direction === 'outgoing';

  const getStatusIcon = () => {
    if (!isOutgoing) return null;

    switch (message.status) {
      case 'sent':
        return <span className="text-gray-400">✓</span>;
      case 'delivered':
        return <span className="text-gray-400">✓✓</span>;
      case 'read':
        return <span className="text-blue-500">✓✓</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-lg shadow-sm ${
          isOutgoing
            ? 'bg-green-100 text-gray-900'
            : 'bg-white text-gray-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-end mt-1">
          <span className="text-xs text-gray-500 mr-1">
            {formatTime(message.timestamp)}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;