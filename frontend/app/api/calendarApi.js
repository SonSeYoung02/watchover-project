import client from "./client";

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// 1. 일일 감정 분석 저장
export const postDailyEmotion = async (chatingRoomId, token, date) => {
  try {
    const response = await client.post(
      `/api/calendar/emotion/${chatingRoomId}`,
      {},
      {
        ...authHeaders(token),
        params: date ? { date } : undefined,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 월간 감정 통계 조회
export const getMonthlyStatistics = async (token, year, month) => {
  try {
    const response = await client.get(
      "/api/calendar/emotion/stats",
      {
        ...authHeaders(token),
        params: { year, month },
      },
    );
    return response.data;
  } catch (error) {
    console.error("통계 API 호출 실패:", error);
    throw error;
  }
};
