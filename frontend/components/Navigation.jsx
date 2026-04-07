import { usePathname, useRouter } from "expo-router";
import {
  Calendar,
  MessageCircle,
  Smile,
  User,
  Users,
} from "lucide-react-native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    // ✅ 모든 경로는 app 폴더를 기준으로 하는 절대 경로(/)로 지정합니다.
    { path: "/aichat/AiChat", icon: MessageCircle, label: "AI 채팅" },
    { path: "/calendar/calendar", icon: Calendar, label: "달력" },
    { path: "/community", icon: Users, label: "커뮤니티" },
    { path: "/character", icon: Smile, label: "캐릭터" },
    { path: "/mypage/Mypage", icon: User, label: "내 공간" },
  ];

  return (
    <View style={styles.bottomNav}>
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        // 현재 경로가 설정된 path로 시작하면 활성화 상태(파란색)로 표시
        const isActive = pathname.startsWith(item.path);

        return (
          <TouchableOpacity
            key={item.path}
            style={styles.navItem}
            onPress={() => router.push(item.path)}
            activeOpacity={0.7}
          >
            <IconComponent size={22} color={isActive ? "#5AA9E6" : "#999999"} />
            <Text style={[styles.navLabel, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: Platform.OS === "ios" ? 85 : 65,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999999",
    marginTop: 4,
  },
  activeLabel: {
    color: "#5AA9E6",
    fontWeight: "800",
  },
});
