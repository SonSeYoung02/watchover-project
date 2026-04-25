import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. 공통으로 사용하는 토글 스위치 부품 (Settings 밖으로 뺌)
const ToggleSwitch = ({ isOn, onToggle }) => (
  <TouchableOpacity
    style={[styles.toggleSwitch, isOn ? styles.toggleOn : styles.toggleOff]}
    onPress={onToggle}
    activeOpacity={0.8}
  >
    <View style={[styles.toggleHandle, isOn ? styles.handleOn : styles.handleOff]} />
    <Text style={[styles.toggleLabel, isOn ? styles.labelOn : styles.labelOff]}>
      {isOn ? 'ON' : 'OFF'}
    </Text>
  </TouchableOpacity>
);

const Settings = () => {
  const navigation = useNavigation();

  const [settings, setSettings] = useState({
    chatbot: true,
    community: true,
    nightPush: false,
    appLock: false,
    faceId: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '확인', 
          onPress: () => {
            // ✅ 로그아웃 시 스택을 완전히 비우고 로그인 화면으로 이동 (잘 하셨습니다!)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.settingsContent} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.itemLabel}>챗봇 알림</Text>
              <Text style={styles.itemSub}>챗봇과의 대화 알림을 실시간으로 받습니다.</Text>
            </View>
            <ToggleSwitch isOn={settings.chatbot} onToggle={() => toggleSetting('chatbot')} />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.itemLabel}>커뮤니티 알림</Text>
              <Text style={styles.itemSub}>내가 쓴 글의 댓글이나 활동 소식을 알려드려요.</Text>
            </View>
            <ToggleSwitch isOn={settings.community} onToggle={() => toggleSetting('community')} />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.itemLabel}>야간 푸시 알림</Text>
              <Text style={styles.itemSub}>밤 9시 ~ 아침 8시 사이에도 알림을 받습니다.</Text>
            </View>
            <ToggleSwitch isOn={settings.nightPush} onToggle={() => toggleSetting('nightPush')} />
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Security Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>보안 설정</Text>
          <View style={[styles.settingItem, styles.simpleItem]}>
            <Text style={styles.itemLabel}>앱 잠금 사용</Text>
            <ToggleSwitch isOn={settings.appLock} onToggle={() => toggleSetting('appLock')} />
          </View>
          <View style={[styles.settingItem, styles.simpleItem]}>
            <Text style={styles.itemLabel}>Face ID / 지문 인식</Text>
            <ToggleSwitch isOn={settings.faceId} onToggle={() => toggleSetting('faceId')} />
          </View>
          <TouchableOpacity style={[styles.settingItem, styles.simpleItem]}>
            <Text style={styles.itemLabel}>비밀번호 변경</Text>
            <ChevronRight size={20} color="#cccccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionDivider} />

        {/* App Info / Other Section */}
        <View style={[styles.settingsSection, { paddingBottom: 60 }]}>
          <Text style={styles.sectionTitle}>기타</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>캐시 데이터 삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>서비스 이용 약관</Text>
          </TouchableOpacity>
          
          {/* 로그아웃 버튼에 handleLogout 함수 연결 */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={[styles.menuItemText, { color: '#FF5A5F' }]}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eeeeee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111111' },
  backBtn: { padding: 4 },
  settingsContent: { flex: 1 },
  settingsSection: { paddingVertical: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#999999', marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  simpleItem: { marginBottom: 28 },
  settingText: { flex: 1, marginRight: 20 },
  itemLabel: { fontSize: 16, fontWeight: '700', color: '#333333' },
  itemSub: { fontSize: 13, color: '#999999', marginTop: 6, lineHeight: 18 },
  toggleSwitch: { width: 56, height: 28, borderRadius: 14, paddingHorizontal: 4, justifyContent: 'center' },
  toggleOn: { backgroundColor: '#5AA9E6' },
  toggleOff: { backgroundColor: '#E5E5EA' },
  toggleHandle: { width: 22, height: 22, backgroundColor: '#ffffff', borderRadius: 11, position: 'absolute' },
  handleOn: { right: 4 },
  handleOff: { left: 4 },
  toggleLabel: { fontSize: 9, fontWeight: '900', color: '#ffffff', position: 'absolute' },
  labelOn: { left: 8 },
  labelOff: { right: 8, color: '#aaaaaa' },
  sectionDivider: { height: 1, backgroundColor: '#f5f5f5', marginHorizontal: 24 },
  menuItem: { marginBottom: 28 },
  menuItemText: { fontSize: 16, fontWeight: '600', color: '#333333' },
});
