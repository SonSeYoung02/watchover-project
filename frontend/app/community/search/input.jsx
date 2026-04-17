import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchInputScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ 검색 실행 핸들러
  const handleSearch = (text) => {
    const word = typeof text === "string" ? text.trim() : "";
    if (!word) return;

    // ⭐ 수정 포인트: AppNavigator에서 정한 name으로 정확히 이동해야 합니다.
    // 만약 AppNavigator에 name="SearchResult"라고 등록했다면 아래처럼 쓰세요.
    navigation.navigate("SearchResult", { q: word });

    // 입력창 비우기 (선택 사항)
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Search color="#999" size={18} />
          <TextInput
            style={styles.input}
            placeholder="궁금한 내용을 검색해보세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoFocus
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X color="#ccc" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }} />
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#ffffff",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  backBtn: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginLeft: 10,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
});
