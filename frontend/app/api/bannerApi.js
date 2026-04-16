import client from './client';

/**
 * 명언(배너) 전체 목록 조회 API
 */
export const getBannerList = async () => {
  try {
    const response = await client.get('/api/banners/list'); // 팀원이 만들어줄 주소
    return response.data; // { code: "SUCCESS", data: [{ message: "...", author: "..." }, ...] }
  } catch (error) {
    console.error("명언 목록 로드 에러:", error);
    throw error;
  }
};

/**
 * 기존 개별 조회 (필요시 유지)
 */
export const getBannerDetail = async (banner_id) => {
  const response = await client.get(`/api/banners/${banner_id}`);
  return response.data;
};