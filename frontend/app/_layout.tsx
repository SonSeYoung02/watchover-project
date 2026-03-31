import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    // 🚨 핵심 포인트: <Stack> 자체에 screenOptions={{ headerShown: false }} 를 줘서
    // 이 앱의 모든 화면에서 기본 영어 헤더가 절대 나타나지 못하게 원천 차단합니다!
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="write" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
