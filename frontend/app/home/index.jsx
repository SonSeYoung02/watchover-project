import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. 검은 화면 방지
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { BotMessageSquare, Users, MessageSquareText, CalendarDays, Rabbit, UserCircle } from 'lucide-react';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';
import './MainHomePage.css';

const MainHomePage = () => {
  const navigate = useNavigate(); // <-- 2. 클릭 시 에러방지

  const quotes = [
    { id: 1, text: "자기 사상의 밑바탕을 바꿀 수 없는 사람은\n결코 현실을 바꾸지 못한다.", author: "안와르 엘 사다트", color: "#FEF08A" },
    { id: 2, text: "어제와 똑같이 살면서\n다른 미래를 기대하는 것은 정신병 초기 증세다.", author: "알베르트 아인슈타인", color: "#60A5FA" },
    { id: 3, text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든,\n당신의 믿음이 옳다.", author: "헨리 포드", color: "#F472B6" }
  ];

  return (
    <div className="main-home-container">
      <header className="main-header">
        <h1 className="app-logo">Cares.</h1>
      </header>

      <section className="banner-section">
        <Swiper
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={1.1}
          centeredSlides={true}
          pagination={{ clickable: true }}
          className="quote-swiper"
        >
          {quotes.map((quote) => (
            <SwiperSlide key={quote.id}>
              <div className="quote-banner-card" style={{ backgroundColor: quote.color }}>
                <span className="quote-tag">명언</span>
                <p className="quote-text">{quote.text}</p>
                <p className="quote-author">{quote.author}</p>
                {/* 3. 클릭 시 이동하도록 onClick 추가 */}
                <span className="quote-list-link" onClick={() => navigate('/quote-list')}>
                  명언 목록
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="action-button-section">
        <button className="action-btn">
          <BotMessageSquare size={20} className="btn-icon" />
          <div>
            <p className="btn-title">지금 바로</p>
            <p className="btn-sub-title">챗봇 상담하기</p>
          </div>
        </button>
        <button className="action-btn">
          <Users size={20} className="btn-icon" />
          <div>
            <p className="btn-title">커뮤니티</p>
            <p className="btn-sub-title">고민 올리기</p>
          </div>
        </button>
      </section>

      <nav className="bottom-nav">
        <div className="nav-item active">
          <MessageSquareText size={24} />
          <span>Ai 채팅</span>
        </div>
        <div className="nav-item">
          <CalendarDays size={24} />
          <span>달력</span>
        </div>
        <div className="nav-item add-button-wrapper">
          <div className="add-button">+</div>
        </div>
        <div className="nav-item">
          <Rabbit size={24} />
          <span>캐릭터</span>
        </div>
        <div className="nav-item">
          <UserCircle size={24} />
          <span>내 공간</span>
        </div>
      </nav>
    </div>
  );
};

export default MainHomePage;