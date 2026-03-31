import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>탐색(Explore) 화면입니다 🚀</Text>
      <Text style={styles.subtitle}>
        나중에 여기에 다른 기능을 추가할 수 있어요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // 세로로 가운데 정렬
    alignItems: "center", // 가로로 가운데 정렬
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
