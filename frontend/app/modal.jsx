import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native"; // View를 여기서 가져와야 합니다.

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>모달 화면</Text>

      {/* 홈으로 돌아가는 링크 */}
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>홈으로 돌아가기</Text>
      </Link>

      {/* 상태바 설정 */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
