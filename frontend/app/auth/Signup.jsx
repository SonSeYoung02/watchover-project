import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const InputField = ({ label, icon: Icon, required, helper, ...props }) => {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>
        {label}
        {required && <Text style={fieldStyles.required}> *</Text>}
      </Text>
      <View style={fieldStyles.inputRow}>
        {Icon && (
          <View style={fieldStyles.iconWrap}>
            <Icon size={17} color="#94A3B8" />
          </View>
        )}
        <TextInput style={[fieldStyles.input, Icon && { paddingLeft: 44 }]} placeholderTextColor="#C0CCDA" {...props} />
      </View>
      {helper && <Text style={fieldStyles.helper}>{helper}</Text>}
    </View>
  );
};

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 7 },
  required: { color: '#5AA9E6' },
  inputRow: { position: 'relative', justifyContent: 'center' },
  iconWrap: { position: 'absolute', left: 14, zIndex: 1 },
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
  const [formData, setFormData] = useState({
    loginId: '',
    nickname: '',
    email: '',
    loginPw: '',
    phone: '',
    gender: 'M',
  });

  const handleChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSignup = () => {
    if (!formData.loginId || !formData.nickname || !formData.email || !formData.loginPw) {
      Alert.alert('알림', '필수 항목(*)을 모두 입력해주세요.');
      return;
    }
    Alert.alert(
      '가입 완료',
      `${formData.nickname}님, 가입을 환영합니다!`,
      [{ text: '확인', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }],
    );
  };

  const isFormValid =
    formData.loginId && formData.nickname && formData.email && formData.loginPw && formData.phone && formData.gender;

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

            <InputField
              label="전화번호"
              icon={Phone}
              placeholder="010-0000-0000"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(t) => handleChange('phone', t)}
            />

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
