import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: '',   // 사진의 '성' 칸에 매칭
    nickname: '',  // 사진의 '이름' 칸에 매칭
    email: '',     // 사진의 '이메일' 칸에 매칭
    loginPw: '',   // 사진의 '비밀번호' 칸에 매칭
    phone: '',     // 사진의 '전화번호' 칸에 매칭 (명세서엔 없어도 화면용으로 유지)
    gender: 'M'    // 화면엔 없지만 명세서 필수값이므로 기본값 유지
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    try {
      // 명세서 규격에 맞춰 전송
      const response = await axios.post('/api/user/register', formData);
      if (response.data.message === "요청 성공") {
        alert(`${response.data.data.nickname}님 환영합니다!`);
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="signup-page-container">
      {/* 1. 헤더: 사진과 동일한 뒤로가기 + 타이틀 */}
      <header className="signup-header">
        <ChevronLeft size={32} onClick={() => navigate(-1)} className="back-icon" />
        <h1 className="header-title">신규 회원가입</h1>
      </header>

      <div className="signup-content">
        <h2 className="section-title">회원 정보</h2>
        
        {/* 2. 성(Last name) -> loginId로 전송 */}
        <div className="input-field">
          <label>성(Last name) *</label>
          <input type="text" name="loginId" placeholder="성을 입력해 주세요." onChange={handleChange} />
        </div>

        {/* 3. 이름(First name) -> nickname으로 전송 */}
        <div className="input-field">
          <label>이름(First name) *</label>
          <input type="text" name="nickname" placeholder="이름을 입력해 주세요." onChange={handleChange} />
        </div>

        {/* 4. 이메일 주소(아이디) -> email로 전송 */}
        <div className="input-field">
          <label>이메일 주소(아이디) *</label>
          <input type="email" name="email" placeholder="이메일(example@care.com)" onChange={handleChange} />
        </div>

        {/* 5. 비밀번호 -> loginPw로 전송 */}
        <div className="input-field">
          <label>비밀번호 *</label>
          <input type="password" name="loginPw" placeholder="비밀번호를 입력해 주세요." onChange={handleChange} />
          {/* 사진에 있는 상세 도움말 문구로 복구 */}
          <div className="helper-text-group">
            <p># 8~20자</p>
            <p># 영문 + 숫자</p>
            <p>{'# 특수문자 ( 사용가능 문자 : !"#$%&\'()*+,-./:;<=>?@[]^_`{|}~ )'}</p>
          </div>
        </div>

        {/* 6. 전화번호 -> phone으로 전송 (사진에 있는 항목) */}
        <div className="input-field">
          <label>전화번호 *</label>
          <input type="tel" name="phone" placeholder="전화번호를 입력해 주세요." onChange={handleChange} />
        </div>

        {/* 현재 성별 선택 버튼은 없음 */}

        <button className="btn-signup-complete" onClick={handleSignup}>
          회원가입 완료
        </button>
      </div>
    </div>
  );
};

export default SignupPage;