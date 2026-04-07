import { useRouter } from "expo-router";
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

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ 검색 실행 핸들러
  const handleSearch = (text) => {
    const word = typeof text === "string" ? text.trim() : "";
    if (!word) return;

    // 검색어 입력 후 결과 페이지로 이동
    router.push({
      pathname: "/community/search/result",
      params: { q: word },
    });

    // 이동 후 입력창 비우기 (선택 사항)
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* [헤더 영역] 검색바 포함 */}
      <View style={styles.header}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>

        {/* 검색바 */}
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
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X color="#ccc" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 최근 검색어/인기 검색어 섹션이 삭제되어 빈 화면으로 유지됩니다. */}
      {/* 필요 시 여기에 검색 가이드 문구 등을 넣을 수 있습니다. */}
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
    // 안드로이드 상태바 대응
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginLeft: 10,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
});
