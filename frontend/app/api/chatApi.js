import client from './client';

/**
 * 1. 채팅방 생성 및 대화 시작
 */
export const startChatRoom = async (token) => {
  try {
    // 백엔드 명세서 기준: POST /api/chatBot/0
    const response = await client.post('/api/chatBot/0', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("채팅방 생성 에러:", error);
    throw error;
  }
};

/**
 * 2. 메시지 전송 및 AI 답변 수신
 */
export const sendChatMessage = async (chatRoomId, message, token) => {
  try {
    const response = await client.post(`/api/chatBot/${chatRoomId}`, 
      { message: message }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("메시지 전송 에러:", error);
    throw error;
  }
};

/**
 * 3. 대화 종료 및 감정 요약 기록
 */
export const finishAndSummarize = async (chatRoomId, token) => {
  try {
    const response = await client.post(`/api/calendar/emotion/${chatRoomId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("감정 요약 에러:", error);
    throw error;
  }
};

/**
 * 4. 특정 채팅방의 상세 대화 내역 조회
 */
export const getChatDetail = async (chatRoomId, token) => {
  try {
    const response = await client.get(`/api/chatBot/${chatRoomId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("상세 내역 로드 에러:", error);
    throw error;
  }
};

/**
 * 5. 상담 기록 목록 조회
 */
export const getChatList = async (token) => {
  try {
    const response = await client.get('/api/chatBot/list', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // { code: "SUCCESS", data: [...] }
  } catch (error) {
    console.error("상담 기록 로드 에러:", error);
    throw error;
  }
};