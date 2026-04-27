import client from './client';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Send a user message to the AI chatbot.
 * Use chatRoomId=0 for the first message; the server returns the created room id.
 */
export const sendChatMessage = async (
  chatRoomId,
  message,
  token,
  promptFile = 'doctor.txt',
) => {
  try {
    const response = await client.post(
      `/api/chatBot/${chatRoomId}`,
      { promptFile, message },
      authHeaders(token),
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('sendChatMessage response error:', error.response.data);
    }
    console.error('sendChatMessage error:', error);
    throw error;
  }
};

/** Analyze and save the emotion summary for a chat room. */
export const finishAndSummarize = async (chatRoomId, token) => {
  try {
    const response = await client.post(
      `/api/calendar/emotion/${chatRoomId}`,
      {},
      authHeaders(token),
    );
    return response.data;
  } catch (error) {
    console.error('finishAndSummarize error:', error);
    throw error;
  }
};

/** Get all messages for a specific chat room. */
export const getChatDetail = async (chatRoomId, token) => {
  try {
    const response = await client.get(
      `/api/chatBot/${chatRoomId}`,
      authHeaders(token),
    );
    return response.data;
  } catch (error) {
    console.error('getChatDetail error:', error);
    throw error;
  }
};

/** Get the current user's chat room list. */
export const getChatList = async (token) => {
  try {
    const response = await client.get('/api/chatBot/list', authHeaders(token));
    return response.data;
  } catch (error) {
    console.error('getChatList error:', error);
    throw error;
  }
};
