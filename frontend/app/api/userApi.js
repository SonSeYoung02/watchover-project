import client from './client';

/**
 * 내 정보 조회 API
 * @param {string} token - 인증 토큰
 */
export const getUserSearch = async (token) => {
  try {
    const response = await client.get(`/api/user/search/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { code: "SUCCESS", data: { nickname: "...", loginId: "..." } }
  } catch (error) {
    console.error(`내 정보 로드 에러:`, error);
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