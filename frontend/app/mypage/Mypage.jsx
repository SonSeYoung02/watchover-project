import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react-native";
import {
  Image,
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
import { getMyCharacterImages, selectMyCharacterImage } from "../api/characterApi";

const MyPage = () => {
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState({
    nickname: "불러오는 중...",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [characterImages, setCharacterImages] = useState([]);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const result = await getUserSearch(token);
        const storedProfileImage = await AsyncStorage.getItem('selectedProfileImage');

        if (result && result.code === "SUCCESS" && result.data) {
          const serverUser = result.data;
          setUserInfo({
            nickname: serverUser.nickname || "이름 없음",
            email: serverUser.email || serverUser.loginId || "이메일 정보 없음",
          });
          setProfileImage(storedProfileImage || serverUser.characterImage || null);
        } else {
          setProfileImage(storedProfileImage);
        }

        const imagesResult = await getMyCharacterImages(token);
        if (imagesResult?.code === "SUCCESS" && Array.isArray(imagesResult.data)) {
          setCharacterImages(imagesResult.data);
        }
      } catch (error) {
        console.error("내 정보 로드 실패:", error);
      }
    };
    fetchMyData();
  }, []);

  const selectProfileImage = async (imageUrl) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("알림", "로그인이 필요합니다.");
        return;
      }

      await selectMyCharacterImage(imageUrl, token);
      await AsyncStorage.setItem('selectedProfileImage', imageUrl);
      await AsyncStorage.setItem('characterImage', imageUrl);
      setProfileImage(imageUrl);
      Alert.alert("프로필 설정", "선택한 캐릭터가 홈 화면에 표시됩니다.");
    } catch (error) {
      console.error("프로필 이미지 저장 실패:", error);
      Alert.alert("오류", "프로필 이미지를 저장하지 못했습니다.");
    }
  };

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
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileAvatarImage} />
              ) : (
                <SettingsIcon color="#ffffff" size={32} />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userInfo.nickname} 님</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
            </View>
          </View>
          <View style={styles.profilePicker}>
            <Text style={styles.profilePickerTitle}>프로필 캐릭터 선택</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.profileImageList}
            >
              {characterImages.length > 0 ? (
                characterImages.map((imageUrl) => {
                  const isSelected = profileImage === imageUrl;
                  return (
                    <TouchableOpacity
                      key={imageUrl}
                      style={[styles.profileImageButton, isSelected && styles.profileImageSelected]}
                      onPress={() => selectProfileImage(imageUrl)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: imageUrl }} style={styles.profileOptionImage} />
                      {isSelected && (
                        <View style={styles.profileSelectedBadge}>
                          <Text style={styles.profileSelectedBadgeText}>선택됨</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyProfileImages}>
                  <Text style={styles.emptyProfileImagesText}>생성된 캐릭터가 없습니다.</Text>
                </View>
              )}
            </ScrollView>
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
    overflow: "hidden",
  },
  profileAvatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profilePicker: {
    marginTop: 24,
  },
  profilePickerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
    marginBottom: 12,
  },
  profileImageList: {
    minHeight: 110,
    gap: 12,
    paddingRight: 4,
  },
  profileImageButton: {
    width: 92,
    height: 104,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
  },
  profileImageSelected: {
    borderColor: "#5AA9E6",
  },
  profileOptionImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileSelectedBadge: {
    position: "absolute",
    left: 6,
    right: 6,
    bottom: 6,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(90, 169, 230, 0.92)",
    alignItems: "center",
  },
  profileSelectedBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyProfileImages: {
    width: 260,
    height: 104,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF3F8",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyProfileImagesText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
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
