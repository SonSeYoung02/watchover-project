import { useNavigation } from '@react-navigation/native';
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Shield,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert, // Alert 추가됨
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react'; 
import client from '../api/client'; 

const MyPage = () => {
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState({
    nickname: '불러오는 중...',
    email: '',
  });

  const [settings, setSettings] = useState({
    chatbot: true,
    community: true,
    nightPush: false,
    appLock: false,
    faceId: false,
  });
// 2. 서버에서 내 정보 조회 (명세서: GET /api/user/search/{userId})
  useEffect(() => {
    const fetchMyData = async () => {
      try {
         // 우선은 테스트를 위해 1번 유저를 조회하고있슴 /api/user/search/1 ->/api/user/search/${loginId}
        // 실제로는 로그인 시 저장된 userId를 넣어야함
        const response = await client.get('/api/user/search/1'); 
        if (response.data && response.data.data) {
          const serverUser = response.data.data;
          setUserInfo({
            nickname: serverUser.name || '이름 없음',// 명세서 기준 name 필드
            email: serverUser.loginId || '이메일 정보 없음',// 명세서 기준 loginId 필드
          });
        }
      } catch (error) {
        console.error('내 정보 로드 실패:', error);
      }
    };
    fetchMyData();
  }, []);

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
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } 
        },
      ]
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          style={styles.backBtn}
        >
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 정보</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <SettingsIcon color="#ffffff" size={32} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userInfo.nickname} 님</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mypageContent}>
          <View style={styles.menuGroup}>
            <Text style={styles.groupTitle}>활동 내역</Text>
            <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: '#FFF0F0' }]}>
                  <Heart size={20} color="#FF5A5F" fill="#FF5A5F" />
                </View>
                <Text style={styles.menuText}>좋아요 한 명언</Text>
              </View>
              <ChevronRight size={18} color="#cccccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuGroup}>
            <Text style={styles.groupTitle}>알림 설정</Text>
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <Text style={styles.itemLabel}>챗봇 알림</Text>
                  <Text style={styles.itemSub}>실시간 대화 알림 받기</Text>
                </View>
                <ToggleSwitch isOn={settings.chatbot} onToggle={() => toggleSetting('chatbot')} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <Text style={styles.itemLabel}>커뮤니티 알림</Text>
                  <Text style={styles.itemSub}>게시글 활동 소식 받기</Text>
                </View>
                <ToggleSwitch isOn={settings.community} onToggle={() => toggleSetting('community')} />
              </View>
            </View>
          </View>

          <View style={[styles.menuGroup, { marginBottom: 60 }]}>
            <Text style={styles.groupTitle}>기타</Text>
            <TouchableOpacity style={styles.footerActionItem}>
              <Text style={styles.footerActionText}>서비스 이용 약관</Text>
            </TouchableOpacity>
            
            {/* 로그아웃 버튼 수정됨 */}
            <TouchableOpacity 
              style={styles.footerActionItem} 
              onPress={handleLogout}
            >
              <View style={styles.logoutBtn}>
                <LogOut size={18} color="#FF5A5F" />
                <Text style={styles.logoutText}>로그아웃</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eeeeee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111111' },
  backBtn: { padding: 4 },
  profileSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  profileCard: { flexDirection: 'row', alignItems: 'center' },
  profileAvatar: {
    width: 64, height: 64, backgroundColor: '#5AA9E6', borderRadius: 32,
    marginRight: 16, justifyContent: 'center', alignItems: 'center'
  },
  userName: { fontSize: 24, fontWeight: '800', color: '#111111', marginBottom: 2 },
  userEmail: { fontSize: 14, color: '#888888' },
  mypageContent: { paddingHorizontal: 20, paddingBottom: 40, marginTop: 24 },
  menuGroup: { marginBottom: 40 },
  groupTitle: { fontSize: 14, fontWeight: '800', color: '#999999', marginBottom: 16, paddingLeft: 4, textTransform: 'uppercase' },
  menuItemCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#ffffff', padding: 16, borderRadius: 18, marginBottom: 12,
    borderWidth: 1, borderColor: '#f0f0f0', elevation: 1,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '700', color: '#333333' },
  settingsContainer: { backgroundColor: '#ffffff', padding: 20, borderRadius: 18, borderWidth: 1, borderColor: '#f0f0f0' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  settingText: { flex: 1, marginRight: 16 },
  itemLabel: { fontSize: 16, fontWeight: '700', color: '#333333' },
  itemSub: { fontSize: 13, color: '#999999', marginTop: 4 },
  toggleSwitch: { width: 52, height: 26, borderRadius: 13, paddingHorizontal: 4, justifyContent: 'center' },
  toggleOn: { backgroundColor: '#5AA9E6' },
  toggleOff: { backgroundColor: '#E5E5EA' },
  toggleHandle: { width: 20, height: 20, backgroundColor: '#ffffff', borderRadius: 10 },
  handleOn: { alignSelf: 'flex-end' },
  handleOff: { alignSelf: 'flex-start' },
  toggleLabel: { fontSize: 8, fontWeight: '900', color: '#ffffff', position: 'absolute' },
  labelOn: { left: 8 },
  labelOff: { right: 8, color: '#aaaaaa' },
  footerActionItem: { paddingVertical: 12, paddingHorizontal: 4, marginBottom: 8 },
  footerActionText: { fontSize: 15, fontWeight: '600', color: '#666666' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#FF5A5F' },
});