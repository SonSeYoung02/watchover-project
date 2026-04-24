import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Splash() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // 스플래시 화면을 2초간 보여줍니다.
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // 로그인 화면으로 이동
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      } catch (error) {
        console.error("스플래시 화면 처리 중 오류:", error);
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    };

    checkAuthAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Text style={styles.logo}>Cares.</Text>
      <Text style={styles.subtitle}>당신의 일상을 돌보는 공간</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 56,
    fontWeight: "900",
    color: "#5AA9E6",
    letterSpacing: -2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
});
