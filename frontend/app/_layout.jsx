import axios from "axios";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";

// 1️⃣ 백엔드 API 서버 기본 주소 설정
axios.defaults.baseURL =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <StatusBar style="dark" />

      <Stack
        // ✅ 앱 시작 시 첫 화면을 auth/Login으로 지정
        initialRouteName="auth/Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F9F9F9" },
        }}
      >
        {/* 2️⃣ 인증 및 로그인 관련 */}
        <Stack.Screen name="auth/Login" />
        <Stack.Screen name="auth/Signup" />
        {/* 3️⃣ 메인 홈 및 명언 관련 */}
        <Stack.Screen name="home/index" />
        <Stack.Screen name="home/quotes" />
        {/* 4️⃣ AI 채팅 관련 (실제 폴더명 aichat 기준) */}
        <Stack.Screen name="aichat/AiChat" />
        <Stack.Screen name="aichat/ChatHistory" />
        <Stack.Screen name="aichat/ChatDetail" />
        {/* 5️⃣ 캐릭터 생성 프로세스 */}
        <Stack.Screen name="character/index" />
        <Stack.Screen name="character/create" />
        <Stack.Screen name="character/result" />
        {/* 6️⃣ 마이페이지 및 설정 (mypage 폴더 기준 정리) */}
        <Stack.Screen name="mypage/Mypage" /> {/* ✅ 하단바 '내 공간' 연결 */}
        <Stack.Screen name="mypage/Settings" /> {/* ✅ 톱니바퀴 버튼 연결 */}
        {/* 7️⃣ 커뮤니티 관련 */}
        <Stack.Screen name="community/index" />
        <Stack.Screen name="community/post/[post]" />
        <Stack.Screen name="community/search/result" />
        {/* 8️⃣ 기타 기능 */}
        <Stack.Screen name="calendar/index" />
      </Stack>
    </View>
  );
}
