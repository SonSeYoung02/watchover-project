import client from "./client";

/**
 * ✅ 1. 전체 게시글 목록 조회
 * 주소: GET /api/community/list
 */
export const getPostList = async (token) => {
  try {
    const response = await client.get("/api/community/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 목록 로드 에러:", error);
    throw error;
  }
};

/**
 * ✅ 2. 인기 게시글 조회
 * 주소: GET /api/community/post/popular
 */
export const getPopularPostList = async (token) => {
  try {
    const response = await client.get("/api/community/post/popular", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("인기 게시글 로드 에러:", error);
    throw error;
  }
};

/**
 * ✅ 3. 게시글 등록 (image_429603.png 명세서 완벽 반영)
 * 주소: POST /api/community/post
 */
export const createPost = async (postData, token) => {
  try {
    // 📋 [Request Header] Content-Type과 Authorization 설정
    const response = await client.post("/api/community/post", postData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // 📋 [Response] 성공 시 { "postId": ... } 반환됨
    return response.data;
  } catch (error) {
    console.error("게시글 등록 API 에러:", error);
    throw error;
  }
};

/**
 * ✅ 4. 게시글 상세 조회
 */
export const getPostDetail = async (postId, token) => {
  try {
    const response = await client.get(`/api/community/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 상세 로드 에러:", error);
    throw error;
  }
};

/**
 * ✅ 5. 댓글 등록
 */
export const registerComment = async (postId, content, token) => {
  try {
    const response = await client.post(
      `/api/community/post/${postId}/comment`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error("댓글 등록 에러:", error);
    throw error;
  }
};
