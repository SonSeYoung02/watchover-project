import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');

  const handleLogin = async () => {
  if (loginId && loginPw) {
    try {
      const result = await login({ loginId, loginPw });

      console.log("📡 서버 응답 전체 데이터:", JSON.stringify(result, null, 2));

      if (result.code === "SUCCESS" || result.message === "요청 성공") {
        
        // ✅ [추가] 서버가 보내준 토큰을 저장합니다.
        // 백엔드 명세서에 따라 result.data.accessToken 인지 확인이 필요합니다.
        if (result.data && result.data.token) {
          await AsyncStorage.setItem('userToken', result.data.token);
          console.log("🔑 토큰 저장 완료:", result.data.token);
        }

        Alert.alert('성공', '로그인 되었습니다.');
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        Alert.alert('로그인 실패', result.message || '아이디나 비밀번호를 확인해주세요.');
      }
    } catch (error) {
       console.error(error);
       Alert.alert('에러', '서버 연결에 실패했습니다.');
    }
  } else {
     Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
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
          <Text style={styles.loginLogo}>Cares TEST</Text>

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

          <View style={styles.loginFooter}>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  loginLogo: {
    fontSize: 48,
    fontWeight: '900',
    color: '#5AA9E6',
    marginBottom: 50,
    letterSpacing: -2,
  },
  loginForm: {
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#000',
  },
  loginBtn: {
    width: '100%',
    padding: 16,
    backgroundColor: '#5AA9E6',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#5AA9E6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  loginBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  loginFooter: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#D1D1D6',
  },
});
