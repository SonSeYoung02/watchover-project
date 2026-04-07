import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CharacterCreate() {
  const router = useRouter();
  const { userPhoto } = useLocalSearchParams();

  useEffect(() => {
    // 💡 4초 뒤 결과 화면으로 자동 이동
    const timer = setTimeout(() => {
      // replace를 사용하여 로딩 화면으로 뒤로가기 방지
      router.replace({
        pathname: "/character/result",
        params: { userPhoto: userPhoto }, // 원본 사진 전달
      });
    }, 4000); // 4000밀리초 = 4초

    // 컴포넌트가 사라질 때 타이머 청소 (메모리 누수 방지)
    return () => clearTimeout(timer);
  }, [router, userPhoto]);

  return (
    <View style={styles.container}>
      {/* 어두운 배경에 맞게 상태바 텍스트를 흰색으로 설정 */}
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay}>
        {/* 1. 중앙: ✅ 성별이 없는 중성적이고 귀여운 AI/생성 아이콘으로 교체 */}
        <View style={styles.imageContainer}>
          <Image
            // 남/여 특정하지 않고 AI 프로세싱을 상징하는 중성적이고 귀여운 로봇/붓 아이콘
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3532/3532851.png",
            }}
            style={styles.characterImg}
            resizeMode="contain"
          />
          {/* 하단 로딩 스피너 (색상은 그대로 유지) */}
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#82C9F9" />
          </View>
        </View>

        {/* 2. 설명 문구 */}
        <View style={styles.textGroup}>
          <Text style={styles.mainInfoText}>캐릭터 생성 중...</Text>
          <Text style={styles.subInfoText}>
            AI가 사진을 분석하여{"\n"}나만의 캐릭터를 그려내고 있습니다.
          </Text>
        </View>

        {/* 3. 하단 취소 버튼 (유지) */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()} // 이전 화면(index)으로 돌아가기
          activeOpacity={0.8}
        >
          <Text style={styles.cancelBtnText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E", // 어두운 밤하늘색 배경 (유지)
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  imageContainer: {
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  characterImg: {
    width: 140, // 크기 살짝 조정
    height: 140,
    marginBottom: 10,
  },
  loaderWrapper: {
    marginTop: 20, // 이미지 아래로 간격
  },
  textGroup: {
    alignItems: "center",
    marginBottom: 100,
  },
  mainInfoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF", // 흰색 텍스트 (유지)
    marginBottom: 15,
  },
  subInfoText: {
    fontSize: 15,
    color: "#AEAEB2", // 회색 텍스트 (유지)
    textAlign: "center",
    lineHeight: 22,
  },
  cancelBtn: {
    position: "absolute",
    bottom: 60,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // 투명도 있는 버튼 (유지)
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelBtnText: {
    color: "#E5E5EA", // 버튼 텍스트 색상 (유지)
    fontSize: 16,
    fontWeight: "600",
  },
});
