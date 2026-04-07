import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
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

export default function CharacterIndex() {
  const router = useRouter();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      // ✅ 라이브러리 버전에 상관없이 가장 안전한 'images' 문자열 사용
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("사진 선택 에러:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나만의 캐릭터 만들기</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* 사진 업로드 박스 */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.img} />
          ) : (
            <View style={styles.placeholder}>
              <View style={styles.plusCircle}>
                <Text style={styles.plusText}>+</Text>
              </View>
              <Text style={styles.uploadBoxText}>사진 업로드</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 안내 문구 */}
        <View style={styles.infoTextGroup}>
          <Text style={styles.mainInfoText}>
            본인의 얼굴이 잘 나온{"\n"}사진을 올려주세요.
          </Text>
        </View>

        {/* ✅ 캐릭터 생성하기 버튼: 사진 유무와 상관없이 클릭 시 바로 이동 */}
        <TouchableOpacity
          style={styles.genBtn} // disabled 스타일 제거하여 항상 활성화 상태로 표시
          onPress={() => {
            router.push({
              pathname: "/character/create",
              params: { userPhoto: image }, // 사진이 없으면 null이 전달됨
            });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>캐릭터 생성하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 50 : 10,
    height: Platform.OS === "android" ? 100 : 60,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111" },
  backBtn: { padding: 4 },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  uploadBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#E6F4FE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#A2CFFE",
    borderStyle: "dashed",
  },
  img: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { alignItems: "center" },
  plusCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1D1D6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  plusText: { fontSize: 40, color: "#fff", fontWeight: "300" },
  uploadBoxText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  infoTextGroup: { marginBottom: 20, alignItems: "center" },
  mainInfoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
  genBtn: {
    backgroundColor: "#82C9F9", // 항상 활성화된 색상
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 40,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
