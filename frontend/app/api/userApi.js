import client from './client';

/**
 * 내 정보 조회 API
 * @param {string|number} userId - 조회할 유저의 ID
 */
export const getUserSearch = async (userId, token) => {
  try {
    const response = await client.get(`/api/user/search/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { code: "SUCCESS", data: { name: "...", loginId: "..." } }
  } catch (error) {
    console.error(`유저 ${userId} 정보 로드 에러:`, error);
    throw error;
  }
};

/* // app/api/userApi.js 에 추가할 예시
export const updateSettings = async (settingsData, token) => {
  try {
    const response = await client.patch('/api/user/settings', settingsData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("설정 업데이트 에러:", error);
    throw error;
  }
}; */