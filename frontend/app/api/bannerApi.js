import client from './client';

/**
 * 명언(배너) 전체 목록 조회 API
 */
export const getBannerList = async () => {
  try {
    const response = await client.get('/api/banners');
    return response.data;
  } catch (error) {
    console.error('배너 목록 로드 에러:', error);
    throw error;
  }
};

/**
 * 배너 단건 조회 API
 */
export const getBannerDetail = async (bannerId) => {
  const response = await client.get(`/api/banners/${bannerId}`);
  return response.data;
};
