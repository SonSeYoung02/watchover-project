import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Eye, EyeOff, Lock, Mail, User, Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// ✅ 변경: client 대신 authApi에서 signup 함수 임포트
import { signup } from '../api/authApi'; 

const InputField = ({ label, icon: Icon, required, helper, hasError, ...props }) => {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>
        {label}
        {required && <Text style={fieldStyles.required}> *</Text>}
      </Text>
      <View style={fieldStyles.inputRow}>
        {Icon && (
          <View style={fieldStyles.iconWrap}>
            <Icon size={17} color={hasError ? "#EF4444" : "#94A3B8"} />
          </View>
        )}
        <TextInput 
          style={[
            fieldStyles.input, 
            Icon && { paddingLeft: 44 }, 
            hasError && { borderColor: '#EF4444', paddingRight: 44 }
          ]} 
          placeholderTextColor="#C0CCDA" 
          {...props} 
        />
        {hasError && (
          <View style={fieldStyles.errorIconWrap}>
            <Info size={17} color="#EF4444" />
          </View>
        )}
      </View>
      {helper ? <Text style={[fieldStyles.helper, hasError && { color: '#EF4444' }]}>{helper}</Text> : null}
    </View>
  );
};

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 7 },
  required: { color: '#5AA9E6' },
  inputRow: { position: 'relative', justifyContent: 'center' },
  iconWrap: { position: 'absolute', left: 14, zIndex: 1 },
  errorIconWrap: { position: 'absolute', right: 14, zIndex: 1 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1E293B',
  },
  helper: { marginTop: 6, fontSize: 12, color: '#94A3B8', paddingLeft: 2 },
});

const Signup = () => {
  const navigation = useNavigation();
  const [showPw, setShowPw] = useState(false);
  const [idError, setIdError] = useState(false);
  const [idErrorMsg, setIdErrorMsg] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [modalConfig, setModalConfig] = useState({ visible: false, type: 'info', title: '', message: '', onConfirm: null });

  const showModal = (type, title, message, onConfirm = null) => {
    setModalConfig({ visible: true, type, title, message, onConfirm });
  };
  const hideModal = () => setModalConfig(prev => ({ ...prev, visible: false }));
  const [formData, setFormData] = useState({
    loginId: '',
    nickname: '',
    email: '',
    loginPw: '',
    phone: '',
    gender: 'M',
  });

  const handleChange = (name, value) => {
    const sanitized = value.replace(/\s/g, '');
    setFormData({ ...formData, [name]: sanitized });
    if (name === 'loginId') {
      setIdError(false);
      setIdErrorMsg('');
    }
    if (name === 'email') {
      setEmailError(false);
      setEmailErrorMsg('');
    }
  };

  const handleSignup = async () => {
    if (!formData.loginId || !formData.nickname || !formData.email || !formData.loginPw) {
      showModal('info', '알림', '필수 항목(*)을 모두 입력해주세요.');
      return;
    }

    try {
      // ✅ 변경: 키(Key) 이름을 API 명세서와 100% 일치시킵니다.
      const result = await signup({
        loginId: formData.loginId, // userId -> loginId 로 변경
        loginPw: formData.loginPw, // password -> loginPw 로 변경
        nickname: formData.nickname,
        email: formData.email,
        // phone: formData.phone, // 명세서에 없더라도 백엔드에서 받으면 유지, 안 받으면 제외
        gender: formData.gender,
      });

      // ✅ 변경: 명세서의 성공 응답 형식 확인
      // 만약 백엔드에서 성공 시 code: "SUCCESS" 가 아니라 
      // 그냥 "요청 성공" 메시지만 준다면 조건을 result.message === "요청 성공" 등으로 바꿔야 할 수도 있습니다.
      if (result.message === "요청 성공" || result.code === "SUCCESS") {
        showModal('success', '가입 완료', `${formData.nickname}님, 가입을 환영합니다!`, () => {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        });
      } else {
        const errorCode = result.code;
        if (errorCode === 'U002') {
          setIdError(true);
          setIdErrorMsg('이미 존재하는 아이디입니다');
        } else if (errorCode === 'U003') {
          setEmailError(true);
          setEmailErrorMsg('이미 존재하는 이메일입니다');
        } else if (errorCode === 'G001') {
          setEmailError(true);
          setEmailErrorMsg('이메일 형식이 올바르지 않습니다');
        }

      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error);
      const errorData = error.response?.data;
      if (errorData) {
        const errorCode = errorData.code;
        if (errorCode === 'U002') {
          setIdError(true);
          setIdErrorMsg('이미 존재하는 아이디입니다');
          return;
        } else if (errorCode === 'U003') {
          setEmailError(true);
          setEmailErrorMsg('이미 존재하는 이메일입니다');
          return;
        } else if (errorCode === 'G001') {
          setEmailError(true);
          setEmailErrorMsg('이메일 형식이 올바르지 않습니다');
          return;
        }
      }
    }
  };

  const isFormValid =
    formData.loginId && formData.nickname && formData.email && formData.loginPw && formData.gender;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={26} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>신규 회원가입</Text>
        <View style={{ width: 36 }} />
      </View>

      <Modal transparent animationType="fade" visible={modalConfig.visible} onRequestClose={hideModal}>
        <Pressable style={modalStyles.backdrop} onPress={hideModal}>
          <Pressable style={modalStyles.card} onPress={() => {}}>
            <View style={[modalStyles.iconWrap, modalConfig.type === 'success' ? modalStyles.iconSuccess : modalConfig.type === 'error' ? modalStyles.iconError : modalStyles.iconInfo]}>
              {modalConfig.type === 'success'
                ? <CheckCircle size={32} color="#5AA9E6" />
                : modalConfig.type === 'error'
                ? <XCircle size={32} color="#EF4444" />
                : <AlertCircle size={32} color="#F59E0B" />}
            </View>
            <Text style={modalStyles.title}>{modalConfig.title}</Text>
            <Text style={modalStyles.message}>{modalConfig.message}</Text>
            <TouchableOpacity
              style={[modalStyles.btn, modalConfig.type === 'error' && modalStyles.btnError]}
              activeOpacity={0.8}
              onPress={() => {
                hideModal();
                modalConfig.onConfirm?.();
              }}
            >
              <Text style={modalStyles.btnText}>확인</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── 섹션 1: 계정 정보 ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>계정 정보</Text>
            </View>

            <InputField
              label="아이디"
              icon={User}
              required
              placeholder="아이디를 입력해 주세요"
              value={formData.loginId}
              onChangeText={(t) => handleChange('loginId', t)}
              autoCapitalize="none"
              hasError={idError}
              helper={idErrorMsg}
            />

            <InputField
              label="이름 (닉네임)"
              icon={User}
              required
              placeholder="이름을 입력해 주세요"
              value={formData.nickname}
              onChangeText={(t) => handleChange('nickname', t)}
            />

            <InputField
              label="이메일 주소"
              icon={Mail}
              required
              placeholder="example@care.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(t) => handleChange('email', t)}
              hasError={emailError}
              helper={emailErrorMsg}
            />

            {/* 비밀번호 (눈 아이콘 포함) */}
            <View style={fieldStyles.wrap}>
              <Text style={fieldStyles.label}>
                비밀번호<Text style={fieldStyles.required}> *</Text>
              </Text>
              <View style={fieldStyles.inputRow}>
                <View style={fieldStyles.iconWrap}>
                  <Lock size={17} color="#94A3B8" />
                </View>
                <TextInput
                  style={[fieldStyles.input, { paddingLeft: 44, paddingRight: 48, flex: 1 }]}
                  placeholder="비밀번호를 입력해 주세요"
                  placeholderTextColor="#C0CCDA"
                  secureTextEntry={!showPw}
                  value={formData.loginPw}
                  onChangeText={(t) => handleChange('loginPw', t)}
                />
                <TouchableOpacity
                  onPress={() => setShowPw(!showPw)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                >
                  {showPw
                    ? <Eye size={18} color="#94A3B8" />
                    : <EyeOff size={18} color="#94A3B8" />
                  }
                </TouchableOpacity>
              </View>
              <View style={styles.pwRules}>
                <Text style={styles.pwRule}>• 8~20자</Text>
                <Text style={styles.pwRule}>• 영문 + 숫자 조합</Text>
                <Text style={styles.pwRule}>• 특수문자 사용 가능</Text>
              </View>
            </View>
          </View>

          {/* ── 섹션 2: 추가 정보 ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>추가 정보</Text>
            </View>

            {/* <InputField
              label="전화번호"
              icon={Phone}
              placeholder="010-0000-0000"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(t) => handleChange('phone', t)}
            /> */}

            {/* 성별 선택 */}
            <View style={fieldStyles.wrap}>
              <Text style={fieldStyles.label}>성별</Text>
              <View style={styles.genderRow}>
                {[{ label: '남성', value: 'M' }, { label: '여성', value: 'F' }].map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[styles.genderBtn, formData.gender === g.value && styles.genderBtnActive]}
                    onPress={() => handleChange('gender', g.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.genderLabel, formData.gender === g.value && styles.genderLabelActive]}>
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* 가입 버튼 */}
          <TouchableOpacity
            style={[styles.btnSubmit, !isFormValid && styles.btnDisabled]}
            onPress={handleSignup}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text style={styles.btnSubmitText}>회원가입 완료</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              이미 계정이 있으신가요?{'  '}
              <Text style={styles.loginLinkBold}>로그인</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  /* Header */
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#ffffff',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111111' },

  scrollContent: { paddingBottom: 48, paddingTop: 20 },

  /* Intro */
  introSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#EEF3F8',
  },
  appLogo: { fontSize: 26, fontWeight: '900', color: '#5AA9E6', letterSpacing: -1 },
  introText: { fontSize: 14, color: '#64748B', marginTop: 6 },

  /* Section */
  section: {
    backgroundColor: '#F4F8FC',
    paddingVertical: 22,
    paddingHorizontal: 22,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 18,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  sectionAccent: { width: 4, height: 18, borderRadius: 2, backgroundColor: '#5AA9E6' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B' },

  /* Eye button */
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },

  /* Password rules */
  pwRules: { flexDirection: 'row', gap: 12, marginTop: 8, paddingLeft: 2 },
  pwRule: { fontSize: 12, color: '#94A3B8' },

  /* Gender */
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 14,
    backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  genderBtnActive: { backgroundColor: '#EAF4FD', borderColor: '#5AA9E6' },
  genderLabel: { fontSize: 15, fontWeight: '600', color: '#94A3B8' },
  genderLabelActive: { color: '#5AA9E6', fontWeight: '800' },

  /* Submit */
  btnSubmit: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 17,
    backgroundColor: '#5AA9E6',
    borderRadius: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#5AA9E6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  btnDisabled: { backgroundColor: '#CBD5E1' },
  btnSubmitText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },

  loginLink: { alignItems: 'center', marginTop: 20, paddingVertical: 8 },
  loginLinkText: { fontSize: 14, color: '#94A3B8' },
  loginLinkBold: { color: '#5AA9E6', fontWeight: '800' },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconSuccess: { backgroundColor: '#EAF4FD' },
  iconError:   { backgroundColor: '#FEF2F2' },
  iconInfo:    { backgroundColor: '#FFFBEB' },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#5AA9E6',
    borderRadius: 14,
    alignItems: 'center',
  },
  btnError: { backgroundColor: '#EF4444' },
  btnText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
});
