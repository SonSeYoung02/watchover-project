import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // ✅ expo-router 사용
import { ChevronLeft, Lock } from "lucide-react-native"; // ✅ lucide-react-native 사용

const ChatDetail = () => {
  const { id } = useLocalSearchParams(); // URL 파라미터(id) 가져오기
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>과거 상담 내역</Text>
        <View style={{ width: 24 }} /> {/* 우측 균형용 빈 공간 */}
      </View>

      {/* 2. 채팅 메시지 영역 */}
      <ScrollView
        style={styles.chatMessages}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 날짜 뱃지 (기록 모드 전용) */}
        <View style={styles.historyDateBadge}>
          <Text style={styles.dateText}>2026년 4월 7일 기록</Text>
        </View>

        {/* AI 메시지 예시 */}
        <View style={[styles.messageRow, styles.aiRow]}>
          <View style={styles.aiAvatar}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
          <View style={[styles.bubble, styles.aiBubble]}>
            <Text style={styles.aiText}>
              당시 나눈 대화 내용입니다. (기록 ID: {id})
            </Text>
          </View>
        </View>

        {/* 유저 메시지 예시 */}
        <View style={[styles.messageRow, styles.userRow]}>
          <View style={[styles.bubble, styles.userBubble]}>
            <Text style={styles.userText}>정말 고마웠어!</Text>
          </View>
        </View>
      </ScrollView>

      {/* 3. 하단 종료 안내창 (입력창 대신 노출) */}
      <View style={styles.detailFooterWrapper}>
        <View style={styles.detailFooterBubble}>
          <Lock size={14} color="#999" />
          <Text style={styles.footerText}>이 대화는 종료된 기록입니다.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  backBtn: { padding: 4 },

  chatMessages: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // 푸터 높이만큼 여백
  },
  historyDateBadge: {
    alignSelf: "center",
    backgroundColor: "#eeeeee",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 15,
  },
  dateText: {
    fontSize: 11,
    color: "#888",
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 20,
    maxWidth: "85%",
  },
  aiRow: { alignSelf: "flex-start" },
  userRow: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  aiAvatar: {
    width: 36,
    height: 36,
    backgroundColor: "#f1f3f5",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
  },
  bubble: {
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eeeeee", // 상세 모드라 더 연하게 설정
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: "#4A90E2",
    borderTopRightRadius: 0,
  },
  aiText: { fontSize: 14, color: "#333" },
  userText: { fontSize: 14, color: "#ffffff" },

  // ✅ 하단 종료 안내바 스타일
  detailFooterWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f9f9f9",
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 35 : 20, // 하단 세이프 에어리어 대응
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    alignItems: "center",
  },
  detailFooterBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },
});
