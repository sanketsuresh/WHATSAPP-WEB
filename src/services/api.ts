// Auto-detect API URL for different environments
const getApiUrl = () => {
  // If we're in production (Vercel), use relative URLs
  if (window.location.hostname !== 'localhost') {
    return '';
  }
  // For local development, use localhost
  return 'http://localhost:9000';
};

const API_URL = getApiUrl();

export const fetchConversations = async () => {
  const response = await fetch(`${API_URL}/api/chats/conversations`);
  if (!response.ok) {
    console.error('API Error: Failed to fetch conversations', response.status, response.statusText);
    throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log('Fetched conversations:', data);
  return data;
};

export const fetchMessages = async (wa_id: string) => {
  const response = await fetch(`${API_URL}/api/chats/conversations/${wa_id}/messages`);
  if (!response.ok) {
    console.error(`API Error: Failed to fetch messages for ${wa_id}`, response.status, response.statusText);
    throw new Error(`Failed to fetch messages for ${wa_id}: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log(`Fetched messages for ${wa_id}:`, data);
  return data;
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
    console.error(`API Error: Failed to send message to ${wa_id}`, response.status, response.statusText);
    throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log(`Message sent to ${wa_id}:`, data);
  return data;
};