import { useRouter } from "expo-router"; // ✅ expo-router 사용
import { ChevronLeft } from "lucide-react-native"; // ✅ lucide-react-native 사용
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Signup = () => {
  const router = useRouter();

  // ✅ 백엔드 API 명세서 규격에 맞춘 상태값 유지
  const [formData, setFormData] = useState({
    loginId: "",
    nickname: "",
    email: "",
    loginPw: "",
    phone: "",
    gender: "M",
  });

  // ✅ 값 변경 함수
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = () => {
    // 필수값 체크
    if (
      !formData.loginId ||
      !formData.nickname ||
      !formData.email ||
      !formData.loginPw
    ) {
      Alert.alert("알림", "필수 항목(*)을 모두 입력해주세요.");
      return;
    }

    /* [API 연동 포인트] 나중에 axios.post('/api/user/register', formData) 호출 자리 */

    Alert.alert(
      "가입 완료",
      `${formData.nickname || "회원"}님, 가입을 환영합니다!`,
      // ✅ 경로 수정: /login 대신 실제 경로인 /auth/Login으로 변경하여 검은 화면 방지
      [{ text: "확인", onPress: () => router.replace("/auth/Login") }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>신규 회원가입</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.signupForm}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.sectionTitle}>회원 정보</Text>

          {/* 아이디 입력 */}
          <View style={styles.inputField}>
            <Text style={styles.label}>아이디 *</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력해 주세요."
              value={formData.loginId}
              onChangeText={(text) => handleChange("loginId", text)}
              autoCapitalize="none"
            />
          </View>

          {/* 이름 입력 */}
          <View style={styles.inputField}>
            <Text style={styles.label}>이름(닉네임) *</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력해 주세요."
              value={formData.nickname}
              onChangeText={(text) => handleChange("nickname", text)}
            />
          </View>

          {/* 이메일 입력 */}
          <View style={styles.inputField}>
            <Text style={styles.label}>이메일 주소 *</Text>
            <TextInput
              style={styles.input}
              placeholder="example@care.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputField}>
            <Text style={styles.label}>비밀번호 *</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해 주세요."
              secureTextEntry={true}
              value={formData.loginPw}
              onChangeText={(text) => handleChange("loginPw", text)}
            />
            <View style={styles.helperText}>
              <Text style={styles.helperPara}># 8~20자 영문 + 숫자 조합</Text>
            </View>
          </View>

          {/* 전화번호 입력 */}
          <View style={styles.inputField}>
            <Text style={styles.label}>전화번호 *</Text>
            <TextInput
              style={styles.input}
              placeholder="010-0000-0000"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleChange("phone", text)}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSignupSubmit}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>회원가입 완료</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  backBtn: { padding: 4 },
  signupForm: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 20,
    color: "#5AA9E6",
  },
  inputField: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8E8E93",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 12,
    fontSize: 14,
    backgroundColor: "#F8F9FA",
  },
  helperText: {
    marginTop: 6,
    paddingLeft: 4,
  },
  helperPara: {
    fontSize: 11,
    color: "#FF5A5F",
  },
  btnSignupSubmit: {
    width: "100%",
    padding: 16,
    backgroundColor: "#5AA9E6",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
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
  submitBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});
