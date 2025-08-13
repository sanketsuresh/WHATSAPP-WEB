export interface Message {
  _id: string;
  messageId: string;
  wa_id: string;
  contactName: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  direction: 'incoming' | 'outgoing';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Conversation {
  wa_id: string;
  contactName: string;
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageDirection: 'incoming' | 'outgoing';
  lastMessageStatus: 'sent' | 'delivered' | 'read' | 'failed';
  unreadCount: number;
  totalMessages: number;
}