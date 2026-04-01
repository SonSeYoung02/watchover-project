import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import MainHomePage from './MainHomePage';
import QuoteListPage from './QuoteListPage'; // 1. 메인 홈 페이지 임포트 추가
import axios from 'axios';

// 백엔드 주소가 나오면 변경
axios.defaults.baseURL = 'http://localhost:8080'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 첫 화면: 로그인 */}
        <Route path="/" element={<LoginPage />} /> 
        
        {/* 회원가입 화면 */}
        <Route path="/signup" element={<SignupPage />} /> 
        
        {/* 2. 메인 홈 화면 경로 추가 */}
        <Route path="/main" element={<MainHomePage />} />
        {/* 3. 메인 홈 명언 목록 */} 
        <Route path="/quote-list" element={<QuoteListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;