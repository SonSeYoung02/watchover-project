import client from './client';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * 명언(배너) 전체 목록 조회 API
 */
export const getBannerList = async (token) => {
  try {
    const response = await client.get('/api/banners', authHeaders(token));
    return response.data;
  } catch (error) {
    console.error('배너 목록 로드 에러:', error);
    throw error;
  }
};

/**
 * 배너 단건 조회 API
 */
export const getBannerDetail = async (bannerId, token) => {
  const response = await client.get(`/api/banners/${bannerId}`, authHeaders(token));
  return response.data;
};
