const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchConversations = async () => {
  const response = await fetch(`${API_URL}/api/chats/conversations`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
};

export const fetchMessages = async (wa_id: string) => {
  const response = await fetch(`${API_URL}/api/chats/conversations/${wa_id}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

export const sendMessage = async (wa_id: string, content: string, contactName: string) => {
  const response = await fetch(`${API_URL}/api/messages/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wa_id, content, contactName }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
};