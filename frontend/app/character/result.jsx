import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CharacterResult() {
  const { userPhoto } = useLocalSearchParams();
  const router = useRouter();

  // ✅ [수정] 기본 이미지를 자연사진 대신 중성적인 3D 인물 아바타로 유지합니다.
  const currentImage =
    userPhoto || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>결과 확인</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* 2. 중앙 캐릭터 결과 이미지 */}
        <View style={styles.imageCard}>
          <Image source={{ uri: currentImage }} style={styles.resultImg} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI 생성 완료</Text>
          </View>
        </View>

        {/* ✅ [수정] '사진 변경' 버튼을 삭제하고 글을 위로 올렸습니다. */}
        {/* 3. 텍스트 정보 (이미지 바로 아래 배치) */}
        <View style={styles.textGroup}>
          <Text style={styles.mainTitle}>멋진 캐릭터가 완성됐어요!</Text>
          <Text style={styles.subTitle}>
            세상에 하나뿐인 나만의 캐릭터입니다.
          </Text>
        </View>

        {/* 4. 하단 버튼: 프로필로 결정 */}
        <TouchableOpacity
          style={styles.decideBtn}
          onPress={() => {
            // 최종 선택된 사진을 홈 화면으로 넘김 (params로 전달)
            router.replace({
              pathname: "/home",
              params: { finalProfilePhoto: currentImage },
            });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>프로필로 결정</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 50 : 10,
    height: Platform.OS === "android" ? 100 : 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  imageCard: {
    width: 300,
    height: 300,
    borderRadius: 30,
    backgroundColor: "#F2F2F7",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    // ✅ 글과의 간격을 좁혔습니다.
    marginBottom: 30,
    position: "relative",
  },
  resultImg: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    bottom: -15,
    backgroundColor: "#34C759",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  textGroup: {
    alignItems: "center",
    // ✅ 이미지 바로 아래에 붙도록 마진을 조정했습니다.
    marginBottom: 50,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },
  decideBtn: {
    backgroundColor: "#82C9F9",
    width: "100%",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto", // 화면 맨 아래로 밀기
    marginBottom: 40,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
