import { useRouter } from "expo-router";
import { ChevronLeft, MessageCircle } from "lucide-react-native";
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

const ChatHistory = () => {
  const router = useRouter();

  // 임시 데이터
  const historyData = [
    { id: 101, date: "2025.11.20", summary: "취업 고민에 대한 대화" },
    { id: 102, date: "2025.11.18", summary: "인간관계 스트레스 상담" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상담 기록</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 2. 상담 기록 리스트 */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {historyData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.historyCard}
            // ✅ 경로 수정: 파일명인 ChatDetail로 이동하며 id를 파라미터로 전달
            onPress={() =>
              router.push({
                pathname: "/aichat/ChatDetail",
                params: { id: item.id },
              })
            }
            activeOpacity={0.7}
          >
            {/* 아이콘 영역 */}
            <View style={styles.cardIcon}>
              <MessageCircle size={20} color="#5AA9E6" />
            </View>

            {/* 텍스트 정보 영역 */}
            <View style={styles.cardInfo}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardSummary} numberOfLines={1}>
                {item.summary}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333333",
  },
  backBtn: { padding: 4 },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E6F4FE",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  cardInfo: { flex: 1 },
  cardDate: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5AA9E6",
    marginBottom: 4,
  },
  cardSummary: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
});
