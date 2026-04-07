import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Login = () => {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  const handleLogin = () => {
    if (loginId && loginPw) {
      router.replace("/home/");
    } else {
      Alert.alert("알림", "아이디와 비밀번호를 입력해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ✅ 1. KeyboardAvoidingView를 제거하여 화면 전체 리사이징을 막습니다. */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          // ✅ 2. flexGrow: 1과 justifyContent: "center"를 유지하여 중앙 정렬을 고정합니다.
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 로고 영역 */}
          <Text style={styles.loginLogo}>Cares.</Text>

          {/* 로그인 폼 영역 */}
          <View style={styles.loginForm}>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="아이디"
                placeholderTextColor="#999"
                value={loginId}
                onChangeText={setLoginId}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#999"
                value={loginPw}
                onChangeText={setLoginPw}
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>로그인</Text>
            </TouchableOpacity>
          </View>

          {/* 푸터 영역 */}
          <View style={styles.loginFooter}>
            <TouchableOpacity onPress={() => router.push("/auth/Signup")}>
              <Text style={styles.footerText}>회원가입</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity>
              <Text style={styles.footerText}>아이디/비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    // ✅ 중앙 정렬 유지
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  loginLogo: {
    fontSize: 48,
    fontWeight: "900",
    color: "#5AA9E6",
    marginBottom: 50,
    letterSpacing: -2,
  },
  loginForm: {
    width: "100%",
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
    color: "#000",
  },
  loginBtn: {
    width: "100%",
    padding: 16,
    backgroundColor: "#5AA9E6",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#5AA9E6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  loginFooter: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#D1D1D6",
  },
});
