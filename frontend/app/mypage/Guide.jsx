import { useNavigation } from "@react-navigation/native";
import {
  Bot,
  CalendarDays,
  ChevronLeft,
  MessageSquareText,
  Sparkles,
  UserRound,
} from "lucide-react-native";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GUIDE_ITEMS = [
  {
    icon: Bot,
    color: "#5AA9E6",
    title: "AI 상담",
    description:
      "AI 챗봇과 하루의 감정이나 고민을 자유롭게 이야기할 수 있습니다. 상담을 마치면 대화 내용이 감정 기록으로 저장됩니다.",
  },
  {
    icon: CalendarDays,
    color: "#7CC9A7",
    title: "달력 및 통계",
    description:
      "저장된 감정을 날짜별로 확인하고, 월별 감정 흐름과 선택한 날짜의 감정 기록을 볼 수 있습니다.",
  },
  {
    icon: Sparkles,
    color: "#B8A4D8",
    title: "캐릭터",
    description:
      "나만의 캐릭터를 만들고 프로필 캐릭터로 설정해 홈 화면과 마이페이지에서 사용할 수 있습니다.",
  },
  {
    icon: MessageSquareText,
    color: "#F6C177",
    title: "커뮤니티",
    description:
      "다른 사용자와 이야기를 나누고 게시글을 작성하거나 검색할 수 있습니다.",
  },
  {
    icon: UserRound,
    color: "#F28B82",
    title: "마이페이지",
    description:
      "내 정보와 프로필 캐릭터를 확인하고, 앱 설정과 로그아웃 기능을 사용할 수 있습니다.",
  },
];

export default function Guide() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>앱 사용법</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Watchover를 사용하는 방법</Text>
          <Text style={styles.introText}>
            일상 대화를 감정 기록으로 남기고, 달력과 통계로 마음의 흐름을
            확인해 보세요.
          </Text>
        </View>

        <View style={styles.guideList}>
          {GUIDE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.title} style={styles.guideItem}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  <Icon size={22} color={item.color} />
                </View>
                <View style={styles.guideTextBox}>
                  <Text style={styles.guideTitle}>{item.title}</Text>
                  <Text style={styles.guideDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  backBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
  },
  headerRight: { width: 40 },
  content: { padding: 20, paddingBottom: 48 },
  intro: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF3F8",
    marginBottom: 18,
  },
  introTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    color: "#64748B",
  },
  guideList: { gap: 12 },
  guideItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  guideTextBox: { flex: 1 },
  guideTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1E293B",
    marginBottom: 5,
  },
  guideDescription: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: "#64748B",
  },
});
