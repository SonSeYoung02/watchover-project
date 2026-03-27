import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ loginId: '', loginPw: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  const handleLogin = (e) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지

    // 1. 테스트를 위해 가짜 유저 정보를 사용 (메인 홈에서 보여줄 용도)
    localStorage.setItem('nickname', '김범진'); 
    localStorage.setItem('userId', '1');

    // 2. 서버 검사 없이 바로 메인 화면으로 이동!
    navigate('/main');
  };

 /*  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/login', loginData);
      if (response.data.message === "요청 성공") {

        // 서버가 준 데이터(data.data)에서 유저 아이디와 닉네임 추출
      const { userId, nickname } = response.data.data;
      
      // 브라우저에 저장해서 다른 페이지에서도 쓰게 함
      localStorage.setItem('userId', userId);
      localStorage.setItem('nickname', nickname);
      
      //alert(`${nickname}님, 환영합니다!`);
        // 로그인 성공 시 메인 화면으로 이동 
        navigate('/main');
      } else {
        alert("아이디 또는 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      alert("로그인 서버 연결 실패");
    }
  }; */

  return (
    <div className="login-container">
      <div className="app-image-section">
        <div className="app-image-circle"></div>
        <h1 className="app-text">케어해줘</h1>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-wrapper">
          <User size={20} className="input-icon" />
          <input type="text" name="loginId" placeholder="아이디" onChange={handleChange} />
        </div>
        <div className="input-wrapper">
          <Lock size={20} className="input-icon" />
          <input type="password" name="loginPw" placeholder="비밀번호" onChange={handleChange} />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-login">로그인</button>
          <button type="button" className="btn-signup" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;