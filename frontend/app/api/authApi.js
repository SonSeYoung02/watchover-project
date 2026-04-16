import client from './client';

/**
 * 로그인 API
 * (인자를 하나로 묶고, 키 이름을 명세서에 맞춤)
 */
export const login = async (loginData) => { // 1. 인자를 객체 하나(loginData)로 받습니다.
  try {
    const response = await client.post('/api/user/login', {
      loginId: loginData.loginId, // 2. userId -> loginId 로 변경
      loginPw: loginData.loginPw, // 3. password -> loginPw 로 변경
    });
    return response.data;
  } catch (error) {
    console.error("로그인 API 에러:", error);
    throw error;
  }
};

/**
 * 회원가입 API
 * (주소를 register로 수정하고 에러 처리를 추가했습니다)
 */
export const signup = async (userData) => {
  try {
    // Signup.jsx 주석에 적힌 대로 /register 주소를 사용합니다.
    const response = await client.post('/api/user/register', userData);
    return response.data;
  } catch (error) {
    console.error("회원가입 API 에러:", error);
    throw error;
  }
};