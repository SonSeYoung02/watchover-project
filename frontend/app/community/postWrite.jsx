import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WriteScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ⭐ API 통신을 담당할 '저장' 함수
  const handleSave = async () => {
    // 1. 빈칸 검사
    if (!title.trim() || !content.trim()) {
      Alert.alert("알림", "제목과 내용을 모두 입력해주세요!");
      return;
    }

    try {
      // 🚨 주의: 실제 백엔드 IP 주소로 수정 필요
      const API_URL = "http://여기에_백엔드_IP주소_입력/api/posts/create";

      // 2. 백엔드로 데이터 전송 (POST 요청)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      // 3. 서버 응답 확인
      if (response.ok) {
        Alert.alert("성공", "게시글이 작성되었습니다!");
        router.replace("/community"); // 커뮤니티 화면으로 이동
      } else {
        Alert.alert("실패", "게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 통신 에러:", error);
      Alert.alert("에러", "서버와 연결할 수 없습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* [헤더 영역] */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/community");
            }
          }}
          style={styles.headerLeft}
        >
          <ChevronLeft color="black" size={28} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>글 작성</Text>

        <TouchableOpacity style={styles.headerRight} onPress={handleSave}>
          <Text style={styles.saveText}>등록</Text>
        </TouchableOpacity>
      </View>

      {/* [입력 영역] */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled" // 키보드가 올라왔을 때 입력창 밖을 터치하면 키보드를 내립니다.
        >
          {/* [제목 입력창] */}
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            maxLength={100} // 제목 글자수 제한 추가 (선택사항)
          />

          {/* [본문 입력창] - 하단 버튼이 사라져서 영역이 더 넓어졌습니다. */}
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력하세요 (최소 10자 이상)"
            value={content}
            onChangeText={setContent}
            multiline={true}
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // 안드로이드 상단 상태바 겹침 방지
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  headerLeft: {
    position: "absolute",
    left: 8,
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  headerRight: {
    position: "absolute",
    right: 8,
    padding: 10,
    zIndex: 10,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e78b7", // 등록 버튼 색상 (주의: 내용이 비어있으면 색을 흐리게 하는 로직을 추가하면 더 좋습니다.)
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    flexGrow: 1, // 스크롤 뷰 내부가 꽉 차게 합니다.
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  contentInput: {
    flex: 1, // 남은 공간을 모두 차지합니다.
    fontSize: 16,
    color: "#333",
    lineHeight: 24, // 가독성을 위한 줄간격 추가
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: 300, // 최소 높이를 확보합니다.
  },
  // 🗑️ bottomBarContainer, actionButton, actionButtonText 스타일은 삭제되었습니다.
});
