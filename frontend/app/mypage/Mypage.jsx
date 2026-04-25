import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react-native";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserSearch } from "../api/userApi";

const MyPage = () => {
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState({
    nickname: "불러오는 중...",
    email: "",
  });

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const result = await getUserSearch(token);

        if (result && result.code === "SUCCESS" && result.data) {
          const serverUser = result.data;
          setUserInfo({
            nickname: serverUser.nickname || "이름 없음",
            email: serverUser.email || serverUser.loginId || "이메일 정보 없음",
          });
        }
      } catch (error) {
        console.error("내 정보 로드 실패:", error);
      }
    };
    fetchMyData();
  }, []);

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ✅ Header 중앙 정렬 수정 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: "Home" }] })
          }
          style={styles.backBtn}
        >
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>내 정보</Text>

        <View style={styles.headerRight} />
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
                <View
                  style={[styles.iconWrapper, { backgroundColor: "#FFF0F0" }]}
                >
                  <Heart size={20} color="#FF5A5F" fill="#FF5A5F" />
                </View>
                <Text style={styles.menuText}>좋아요 한 명언</Text>
              </View>
              <ChevronRight size={18} color="#cccccc" />
            </TouchableOpacity>
          </View>

          <View style={[styles.menuGroup, { marginBottom: 60 }]}>
            <Text style={styles.groupTitle}>기타</Text>
            <TouchableOpacity style={styles.footerActionItem}>
              <Text style={styles.footerActionText}>서비스 이용 약관</Text>
            </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  // ⭐ 좌우 대칭을 위한 설정
  backBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
  },
  headerRight: { width: 40 },

  profileSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  profileCard: { flexDirection: "row", alignItems: "center" },
  profileAvatar: {
    width: 64,
    height: 64,
    backgroundColor: "#5AA9E6",
    borderRadius: 32,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 2,
  },
  userEmail: { fontSize: 14, color: "#888888" },
  mypageContent: { paddingHorizontal: 20, paddingBottom: 40, marginTop: 24 },
  menuGroup: { marginBottom: 40 },
  groupTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#999999",
    marginBottom: 16,
    paddingLeft: 4,
    textTransform: "uppercase",
  },
  menuItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 1,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: { fontSize: 16, fontWeight: "700", color: "#333333" },
  footerActionItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  footerActionText: { fontSize: 15, fontWeight: "600", color: "#666666" },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#FF5A5F" },
});
