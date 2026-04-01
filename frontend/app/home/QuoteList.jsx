import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './QuoteListPage.css';

const QuoteListPage = () => {
  const navigate = useNavigate();

  // 임의로 정한 명언 데이터 리스트
  const quotes = [
    { id: 1, text: "자기 사상의 밑바탕을 바꿀 수 없는 사람은\n결코 현실을 바꾸지 못한다.", author: "안와르 엘 사다트", color: "#FEF9C3" },
    { id: 2, text: "어제와 똑같이 살면서\n다른 미래를 기대하는 것은 정신병 초기 증세다.", author: "알베르트 아인슈타인", color: "#DBEAFE" },
    { id: 3, text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든,\n당신의 믿음이 옳다.", author: "헨리 포드", color: "#FCE7F3" },
    { id: 4, text: "성공은 최종적인 것이 아니며,\n실패는 치명적인 것이 아니다.", author: "윈스턴 처칠", color: "#DCFCE7" },
    { id: 5, text: "가장 큰 위험은 위험을 감수하지 않는 것이다.", author: "마크 저커버그", color: "#F3E8FF" },
    { id: 6, text: "나 자신을 믿는 순간, 어떻게 살아야 할지 알게 된다.", author: "괴테", color: "#FFEDD5" },
    { id: 7, text: "인생은 우리가 만드는 것이다.\n언제나 그래왔고, 앞으로도 그럴 것이다.", author: "그랜마 모지스", color: "#E0F2FE" }
  ];

  return (
    <div className="quote-list-container">
      {/* 1. 상단 헤더: 뒤로가기 화살표 + 타이틀 */}
      <header className="quote-list-header">
        <ChevronLeft 
          size={32} 
          onClick={() => navigate('/main')} 
          className="back-icon" 
        />
        <h1 className="header-title">명언 목록</h1>
      </header>

      {/* 2. 세로 스크롤 명언 리스트 영역 */}
      <main className="quote-scroll-area">
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-card" style={{ backgroundColor: quote.color }}>
            <span className="quote-tag">명언</span>
            <p className="quote-text">{quote.text}</p>
            <p className="quote-author">{quote.author} | 명언/명대사</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default QuoteListPage;