import client from "./client";

// 1. 일일 감정 요약
export const postDailyEmotion = async (chatingRoomId, token) => {
  try {
    const response = await client.post(
      `/api/calendar/emotion/${chatingRoomId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
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
    return response.data; // 여기서 [ {emotion: "슬픔", count: 5}, ... ] 리스트가 옴
  } catch (error) {
    console.error("통계 API 호출 실패:", error);
    throw error;
  }
};
