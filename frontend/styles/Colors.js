import { Platform, StatusBar } from "react-native";

// 💡 웹의 variables.css를 React Native 전역 상수로 변환
export const Colors = {
  // 메인 컬러: 슬픔, 놀람
  primary: "#5AA9E6",
  primaryLight: "#7FC8F8",

  // 포인트 컬러: 분노, 강조나 버튼용 핑크
  accent: "#FF6392",

  // 배경 및 기본 컬러: 평온, 화이트
  background: "#F9F9F9",
  white: "#FFFFFF",

  // 기쁨 컬러: 경고나 에러용
  warning: "#FFE45E",

  // 텍스트 및 보조 색상 (기존 코드 참고하여 추가)
  textMain: "#333333",
  textSub: "#8E8E93",
  grayBorder: "#EEEEEE",
};

export const Spacing = {
  // 안드로이드/아이폰 전용 여백 대응
  // 웹의 env(safe-area-inset-top)를 Platform API로 대체
  safeTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0,
  safeBottom: Platform.OS === "ios" ? 34 : 0,
};

export const Theme = {
  Colors,
  Spacing,
};
