import axios from "axios";

const client = axios.create({
  baseURL: "http://15.164.113.103",

  // 5초 동안 응답이 없으면 연결을 끊도록 설정 (팀원 코드 반영)
  timeout: 5000,

  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
