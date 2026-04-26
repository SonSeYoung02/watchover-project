import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eye, EyeOff, Info } from "lucide-react-native";
import { login } from "../api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const navigation = useNavigation();
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const clearError = () => {
    setLoginError(false);
    setLoginErrorMsg("");
  };

  const handleLogin = async () => {
    if (!loginId || !loginPw) {
      setLoginError(true);
      setLoginErrorMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({ loginId, loginPw });

      console.log("📡 서버 응답 전체 데이터:", JSON.stringify(result, null, 2));

      if (result.code === "SUCCESS" || result.message === "요청 성공") {
        console.log("🔑 result.data 전체:", JSON.stringify(result.data, null, 2));
        if (result.data && result.data.token) {
          await AsyncStorage.setItem("userToken", result.data.token);
        }
        await AsyncStorage.setItem("userId", loginId);
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      } else {
        setLoginError(true);
        setLoginErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error(error);
      setLoginError(true);
      setLoginErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.loginLogo}>Cares.</Text>

          <View style={styles.loginForm}>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, loginError && styles.inputError]}
                placeholder="아이디"
                placeholderTextColor="#999"
                value={loginId}
                onChangeText={(t) => { setLoginId(t.replace(/\s/g, '')); clearError(); }}
                autoCapitalize="none"
              />
              {loginError && (
                <View style={styles.errorIconRight}>
                  <Info size={18} color="#EF4444" />
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { paddingRight: 50 }, loginError && styles.inputError]}
                placeholder="비밀번호"
                placeholderTextColor="#999"
                value={loginPw}
                onChangeText={(t) => { setLoginPw(t.replace(/\s/g, '')); clearError(); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPressIn={() => setShowPassword(true)}
                onPressOut={() => setShowPassword(false)}
                activeOpacity={1}
              >
                {showPassword ? (
                  <Eye size={20} color="#5AA9E6" />
                ) : (
                  <EyeOff size={20} color="#999" />
                )}
              </TouchableOpacity>
            </View>

            {loginError && (
              <Text style={styles.errorMsg}>{loginErrorMsg}</Text>
            )}

            <TouchableOpacity
              style={[styles.loginBtn, isLoading ? styles.loginBtnDisabled : null]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginBtnText}>로그인</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginFooter}>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.footerText}>회원가입</Text>
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
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
  },
  errorIconRight: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
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
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 1.5,
  },
  errorMsg: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    paddingLeft: 4,
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
      android: { elevation: 6 },
    }),
  },
  loginBtnDisabled: {
    backgroundColor: "#A0C8E8",
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
});
