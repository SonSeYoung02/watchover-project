import axios from 'axios';

const client = axios.create({
  // 팀원분이 주신 서버 IP (뒤에 포트번호 8080이 필요한지 팀원께 꼭 확인해보세요!)
  baseURL: 'http://15.164.113.103', 
  
  // 5초 동안 응답이 없으면 연결을 끊도록 설정 (팀원 코드 반영)
  timeout: 5000, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;