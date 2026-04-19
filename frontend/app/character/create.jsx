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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateCharacter } from "../api/characterApi";

export default function CharacterCreate() {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 다시 실제 사용자가 선택한 사진을 가져옵니다.
  const { userPhoto } = route.params || {};

  useEffect(() => {
    // ✅ 사진이 있을 때만 생성을 시작하도록 다시 복구합니다.
    if (userPhoto) {
      handleCharacterGeneration();
    } else {
      Alert.alert("오류", "분석할 사진이 없습니다.");
      navigation.goBack();
    }
  }, [userPhoto]);

  const handleCharacterGeneration = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      console.log("==========================================");
      console.log("🚀 진짜 사진으로 AI 캐릭터 생성 시작");
      console.log("🔑 토큰 상태:", token ? "보유 중" : "없음");
      console.log("==========================================");

      if (!token) {
        Alert.alert("알림", "로그인 세션이 만료되었습니다.");
        navigation.navigate("Login");
        return;
      }

      // ✅ [중요] lightTestImage 대신 진짜 userPhoto를 보냅니다.
      const response = await generateCharacter(userPhoto, token);

      if (response && response.data && response.data.characterUrl) {
        console.log("✅ 캐릭터 생성 성공!");
        navigation.replace("CharacterResult", {
          generatedImage: response.data.characterUrl,
        });
      }
    } catch (error) {
      console.log("❌ 캐릭터 생성 에러 발생");

      if (error.response) {
        console.log("상태 코드:", error.response.status);
      } else {
        console.log("에러 메시지:", error.message);
      }

      Alert.alert(
        "생성 실패",
        "이미지 분석 시간이 초과되었거나 서버 연결이 원활하지 않습니다.",
      );
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.imageContainer}>
          {/* 로딩 중 보여줄 기본 캐릭터 아이콘 */}
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3532/3532851.png",
            }}
            style={styles.characterImg}
            resizeMode="contain"
          />
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#82C9F9" />
          </View>
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.mainInfoText}>캐릭터 생성 중...</Text>
          <Text style={styles.subInfoText}>
            AI가 사진을 분석하여{"\n"}나만의 캐릭터를 그려내고 있습니다.
          </Text>
        </View>

        {/* 생성 중 취소 버튼 추가 */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
