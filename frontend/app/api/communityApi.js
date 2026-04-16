import client from './client';

/**
 * 1. 전체 게시글 목록 조회
 */
export const getPostList = async () => {
  try {
    const response = await client.get('/api/community/list');
    return response.data; // { code: "SUCCESS", data: [...] }
  } catch (error) {
    console.error("게시글 목록 로드 에러:", error);
    throw error;
  }
};

/**
 * 2. 게시글 상세 조회
 */
export const getPostDetail = async (postId) => {
  try {
    const response = await client.get(`/api/community/${postId}`);
    return response.data;
  } catch (error) {
    console.error("게시글 상세 로드 에러:", error);
    throw error;
  }
};

/**
 * 3. 게시글 작성
 */
export const createPost = async (postData) => {
  try {
    const response = await client.post('/api/community/register', postData);
    return response.data;
  } catch (error) {
    console.error("게시글 등록 에러:", error);
    throw error;
  }
};

// 4. 댓글 등록
export const registerComment = async (commentData) => {
  try {
    const response = await client.post('/api/community/comment', commentData);
    return response.data;
  } catch (error) {
    console.error("댓글 등록 에러:", error);
    throw error;
  }
};