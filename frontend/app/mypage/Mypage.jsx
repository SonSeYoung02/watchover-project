import { useRouter } from "expo-router";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  HelpCircle,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MyPage = () => {
  const router = useRouter();

  // 임시 유저 데이터
  const [userInfo] = useState({
    nickname: "김범진",
    points: 1250,
    email: "example@care.com",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        {/* 왼쪽: 뒤로가기 버튼 */}
        <TouchableOpacity
          // ✅ 실제 홈 화면 경로인 /home (home/index.jsx)으로 이동
          onPress={() => router.replace("/home")}
          style={styles.backBtn}
        >
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>

        {/* 가운데: 타이틀 (중앙 정렬) */}
        <Text style={styles.headerTitle}>내 공간</Text>

        {/* 오른쪽: 설정 버튼 */}
        <TouchableOpacity
          onPress={() => router.push("/mypage/Settings")}
          style={styles.settingsBtn}
        >
          <SettingsIcon size={24} color="#5AA9E6" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. 프로필 카드 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userRank}>일반 회원</Text>
              <Text style={styles.userName}>{userInfo.nickname} 님</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
            </View>
          </View>

          <View style={styles.pointBox}>
            <Text style={styles.pointLabel}>보유 포인트</Text>
            <Text style={styles.pointValue}>
              {userInfo.points.toLocaleString()} P
            </Text>
          </View>
        </View>

        {/* 3. 주요 메뉴 리스트 */}
        <View style={styles.mypageContent}>
          {/* 활동 내역 그룹 */}
          <View style={styles.menuGroup}>
            <Text style={styles.groupTitle}>활동 내역</Text>
            <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Heart size={20} color="#FF5A5F" fill="#FF5A5F" />
                <Text style={styles.menuText}>좋아요 한 명언</Text>
              </View>
              <ChevronRight size={18} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* 고객 지원 그룹 */}
          <View style={styles.menuGroup}>
            <Text style={styles.groupTitle}>고객 지원</Text>

            <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <BookOpen size={20} color="#5AA9E6" />
                <Text style={styles.menuText}>Cares. 이용 가이드</Text>
              </View>
              <ChevronRight size={18} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.rowMenu}>
              <TouchableOpacity style={styles.halfCard} activeOpacity={0.7}>
                <HelpCircle size={22} color="#A3D2F3" />
                <Text style={styles.halfCardText}>자주 묻는 질문</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.halfCard} activeOpacity={0.7}>
                <Headphones size={22} color="#A3D2F3" />
                <Text style={styles.halfCardText}>1:1 문의하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: "#ffffff",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  backBtn: {
    width: 40,
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#333",
  },
  settingsBtn: {
    width: 40,
    alignItems: "flex-end",
  },
  profileSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 15,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    backgroundColor: "#FFE45E",
    borderRadius: 35,
    marginRight: 20,
  },
  userRank: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF5A5F",
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#8E8E93",
  },
  pointBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#A3D2F3",
    padding: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  pointLabel: {
    color: "#ffffff",
    fontWeight: "700",
  },
  pointValue: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "700",
  },
  mypageContent: {
    padding: 25,
    paddingHorizontal: 20,
  },
  menuGroup: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8E8E93",
    marginBottom: 12,
    paddingLeft: 5,
  },
  menuItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  rowMenu: {
    flexDirection: "row",
    gap: 10,
  },
  halfCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  halfCardText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
});
