import client from './client';

export const getPostList = async (token) => {
  try {
    const response = await client.get('/api/community/list', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 목록 로드 에러:', error);
    throw error;
  }
};

export const getPopularPostList = async (token) => {
  try {
    const response = await client.get('/api/community/post/popular', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('인기 게시글 로드 에러:', error);
    throw error;
  }
};

export const createPost = async (postData, token) => {
  try {
    const response = await client.post('/api/community/post', postData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 등록 API 에러:', error);
    throw error;
  }
};

export const getPostDetail = async (postId, token) => {
  try {
    const response = await client.get(`/api/community/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 상세 로드 에러:', error);
    throw error;
  }
};

export const registerComment = async (postId, content, token) => {
  try {
    const response = await client.post(
      `/api/community/post/${postId}/comment`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error('댓글 등록 에러:', error);
    throw error;
  }
};

export const likePost = async (postId, token) => {
  try {
    const response = await client.post(`/api/community/post/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 좋아요 에러:', error);
    throw error;
  }
};

export const bookmarkPost = async (postId, token) => {
  try {
    const response = await client.post(`/api/community/post/${postId}/bookmark`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 북마크 에러:', error);
    throw error;
  }
};
