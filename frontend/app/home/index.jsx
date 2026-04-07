import { useRouter } from "expo-router";
import { BotMessageSquare, Users } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-swiper";

// ✅ 네비게이션 컴포넌트 경로 수정 (app 밖으로 나갔으므로 ../../)
import Navigation from "../../components/Navigation";

const { width } = Dimensions.get("window");

const MainHome = () => {
  const router = useRouter();

  const [quotes] = useState([
    {
      id: 1,
      text: "자기 사상의 밑바탕을 바꿀 수 없는 사람은\n결코 현실을 바꾸지 못한다.",
      author: "안와르 엘 사다트",
      bgColor: "#5AA9E6",
    },
    {
      id: 2,
      text: "어제와 똑같이 살면서\n다른 미래를 기대하는 것은 정신병 초기 증세다.",
      author: "알베르트 아인슈타인",
      bgColor: "#7FBBEA",
    },
    {
      id: 3,
      text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든,\n당신의 믿음이 옳다.",
      author: "헨리 포드",
      bgColor: "#A3D2F3",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.appLogo}>Cares.</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 2. 명언 배너 섹션 */}
        <View style={styles.bannerSection}>
          <Swiper
            style={styles.wrapper}
            autoplay={true}
            autoplayTimeout={5}
            dotColor="rgba(255,255,255,0.4)"
            activeDotColor="#ffffff"
            paginationStyle={{ bottom: 10 }}
            loop={true}
          >
            {quotes.map((quote) => (
              <View
                key={quote.id}
                style={[styles.slide, { backgroundColor: quote.bgColor }]}
              >
                <View style={styles.quoteCard}>
                  <Text style={styles.quoteTag}>오늘의 명언</Text>
                  <Text style={styles.quoteText}>{quote.text}</Text>
                  <Text style={styles.quoteAuthor}>- {quote.author} -</Text>

                  {/* 전체보기 클릭 시 quotes.jsx 경로로 이동 */}
                  <TouchableOpacity
                    onPress={() => router.push("/home/quotes")}
                    style={styles.viewAllContainer}
                  >
                    <Text style={styles.viewAll}>전체보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Swiper>
        </View>

        {/* 3. 중앙 액션 버튼 섹션 */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionCard}
            // ✅ 경로 수정: 현재 사용 중인 AI 채팅 경로로 변경
            onPress={() => router.push("/aichat/AiChat")}
            activeOpacity={0.8}
          >
            <BotMessageSquare
              size={32}
              color="#5AA9E6"
              style={styles.actionIcon}
            />
            <Text style={styles.actionLabel}>상담하기</Text>
            <Text style={styles.actionTitle}>AI 채팅</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/community")}
            activeOpacity={0.8}
          >
            <Users size={32} color="#5AA9E6" style={styles.actionIcon} />
            <Text style={styles.actionLabel}>커뮤니티</Text>
            <Text style={styles.actionTitle}>고민 나누기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 네비게이션 바 */}
      <Navigation />
    </SafeAreaView>
  );
};

export default MainHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 25,
    height: 70,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: Platform.OS === "android" ? 30 : 20,
  },
  appLogo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#5AA9E6",
    letterSpacing: -1,
  },
  bannerSection: {
    width: "100%",
    height: 250,
    marginTop: 5,
  },
  wrapper: {},
  slide: {
    flex: 1,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteCard: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 10,
  },
  quoteTag: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 15,
  },
  quoteAuthor: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  viewAllContainer: {
    marginTop: 20,
    padding: 10,
  },
  viewAll: {
    fontSize: 11,
    color: "#ffffff",
    textDecorationLine: "underline",
  },
  actionSection: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 20,
    marginTop: 25,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#5AA9E6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionIcon: {
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 12,
    color: "#888888",
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
    marginTop: 4,
  },
});
