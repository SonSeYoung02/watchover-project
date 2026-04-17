import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform, // Platform 추가
} from "react-native";

// ✅ 1. API 함수 가져오기
import { generateCharacter } from "../api/characterApi";

export default function CharacterCreate() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userPhoto } = route.params || {};

  // ✅ 2. 화면이 로딩되자마자 서버에 캐릭터 생성을 요청합니다.
  useEffect(() => {
    if (userPhoto) {
      handleCharacterGeneration();
    } else {
      Alert.alert("오류", "전달된 사진이 없습니다.");
      navigation.goBack();
    }
  }, [userPhoto]);

  const handleCharacterGeneration = async () => {
    try {
      // TODO: 실제 프로젝트의 로그인 토큰과 유저 ID를 사용해야 합니다.
      const token = "YOUR_STORED_TOKEN";
      const userId = "1";

      // ✅ 3. 서버에 이미지 전송 및 AI 생성 대기
      const response = await generateCharacter(userPhoto, userId, token);

      if (response && response.data && response.data.characterUrl) {
        // ✅ 4. 성공 시 결과 페이지로 이동 (AI가 생성한 이미지 URL 전달)
        navigation.replace("CharacterResult", {
          generatedImage: response.data.characterUrl,
        });
      }
    } catch (error) {
      console.error("캐릭터 생성 실패:", error);
      Alert.alert(
        "생성 실패",
        "AI가 캐릭터를 생성하는 중에 문제가 발생했습니다.",
      );
      navigation.goBack(); // 실패 시 이전 화면으로
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3532/3532851.png",
            }}
            style={styles.characterImg}
            resizeMode="contain"
          />
          <View style={styles.loaderWrapper}>
            {/* 뱅글뱅글 돌아가는 로딩 표시 */}
            <ActivityIndicator size="large" color="#82C9F9" />
          </View>
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.mainInfoText}>캐릭터 생성 중...</Text>
          <Text style={styles.subInfoText}>
            AI가 사진을 분석하여{"\n"}나만의 캐릭터를 그려내고 있습니다.
          </Text>
        </View>

        {/* 생성 중 취소 버튼 */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelBtnText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ✅ 스타일은 준혁 님이 짜놓은 그대로 유지합니다.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C1C1E" },
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
  characterImg: { width: 140, height: 140, marginBottom: 10 },
  loaderWrapper: { marginTop: 20 },
  textGroup: { alignItems: "center", marginBottom: 100 },
  mainInfoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  subInfoText: {
    fontSize: 15,
    color: "#AEAEB2",
    textAlign: "center",
    lineHeight: 22,
  },
  cancelBtn: {
    position: "absolute",
    bottom: 60,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelBtnText: { color: "#E5E5EA", fontSize: 16, fontWeight: "600" },
});
