import client from "./client";

// 1. 일일 감정 요약
export const postDailyEmotion = async (chatingRoomId, token) => {
  try {
    const response = await client.post(
      `/api/calendar/emotion/${chatingRoomId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data; // { data: { emotion: "슬픔", analyzedAt: "..." } } 리턴
  } catch (error) {
    throw error;
  }
};

// 2. 월간 감정 통계 조회
export const getMonthlyStatistics = async (token) => {
  try {
    const response = await client.get("/api/calendar/emotion/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { data: [ {emotion: "슬픔", count: 1} ] } 리턴
  } catch (error) {
    console.error("통계 API 호출 실패:", error);
    throw error;
  }
};
