import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
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

const TERMS_SECTIONS = [
  {
    title: "1. 서비스 목적",
    body:
      "Watchover는 사용자가 AI 상담, 감정 기록, 달력 통계, 캐릭터, 커뮤니티 기능을 통해 일상과 마음 상태를 돌아볼 수 있도록 돕는 앱입니다.",
  },
  {
    title: "2. AI 상담 이용",
    body:
      "AI 상담은 사용자의 대화를 바탕으로 정서적 지원과 감정 분석을 제공합니다. AI의 답변은 의료, 법률, 심리 치료 등 전문적인 진단이나 처방을 대체하지 않습니다.",
  },
  {
    title: "3. 감정 기록 및 통계",
    body:
      "상담 종료 시 대화 내용을 기반으로 감정이 분석되어 달력과 통계에 저장될 수 있습니다. 통계는 사용자의 자기 이해를 돕기 위한 참고 자료입니다.",
  },
  {
    title: "4. 사용자 콘텐츠",
    body:
      "사용자는 커뮤니티 게시글, 댓글, 이미지 등 본인이 등록한 콘텐츠에 대한 책임을 집니다. 타인을 비방하거나 불법적인 콘텐츠를 게시해서는 안 됩니다.",
  },
  {
    title: "5. 개인정보 및 데이터",
    body:
      "서비스 이용 과정에서 로그인 정보, 상담 기록, 감정 기록, 캐릭터 이미지 등이 처리될 수 있습니다. 민감한 개인정보는 필요한 범위 내에서만 사용되어야 합니다.",
  },
  {
    title: "6. 서비스 제한",
    body:
      "운영자는 서비스 안정성, 보안, 부정 이용 방지, 법령 준수를 위해 일부 기능 이용을 제한하거나 게시물을 삭제할 수 있습니다.",
  },
  {
    title: "7. 책임의 한계",
    body:
      "Watchover는 사용자의 감정 관리와 자기 성찰을 돕는 도구이며, 위급 상황이나 전문 상담이 필요한 경우에는 관련 기관 또는 전문가의 도움을 받아야 합니다.",
  },
  {
    title: "8. 약관 변경",
    body:
      "서비스 운영 상황에 따라 약관은 변경될 수 있으며, 중요한 변경 사항은 앱 내 공지 또는 적절한 방법으로 안내합니다.",
  },
];

export default function Terms() {
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
        <Text style={styles.headerTitle}>서비스 이용 약관</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>Watchover 이용 안내</Text>
          <Text style={styles.noticeText}>
            아래 내용은 앱 이용 시 알아두어야 할 기본 약관입니다.
          </Text>
        </View>

        {TERMS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
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
  noticeBox: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF3F8",
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: "#64748B",
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1E293B",
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 21,
    fontWeight: "600",
    color: "#64748B",
  },
});
