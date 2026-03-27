import { useRouter } from "expo-router";
import { ChevronLeft, FilePlus, Image as ImageIcon } from "lucide-react-native";
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

  // ⭐ API 통신을 담당할 '저장' 함수 만들기
  const handleSave = async () => {
    // 1. 빈칸 검사 (제목이나 내용이 없으면 막기)
    if (!title.trim() || !content.trim()) {
      Alert.alert("알림", "제목과 내용을 모두 입력해주세요!");
      return;
    }

    try {
      // 🚨 주의: 백엔드 컴퓨터의 실제 IP 주소로 바꿔야 합니다! (예: http://192.168.0.12:8080)
      const API_URL = "http://여기에_백엔드_IP주소_입력/api/posts/create";

      // 2. 백엔드로 데이터 쏘기 (POST 요청)
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
        router.replace("/community"); // 커뮤니티 화면으로 돌아가기
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
        {/* ⭐ 뒤로가기 버튼: push를 사용하여 무조건 커뮤니티로 보내버립니다 */}
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
          {/* 아이콘 크기를 28로 키워서 손가락으로 누르기 더 편하게 만들었습니다 */}
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
        >
          {/* [제목 입력창] */}
          <TextInput
            style={styles.titleInput}
            placeholder="[제목]"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />

          {/* [본문 입력창] */}
          <TextInput
            style={styles.contentInput}
            placeholder="[내용]"
            value={content}
            onChangeText={setContent}
            multiline={true}
            textAlignVertical="top"
          />

          {/* [하단 버튼바 영역] */}
          <View style={styles.bottomBarContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <ImageIcon color="#666" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>[이미지 추가]</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <FilePlus color="#666" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>[첨부 파일 추가]</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// [스타일 시트]
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  // ⭐ 핵심 해결책: zIndex와 padding을 추가해서 제목(투명막) 위로 버튼을 꺼냈습니다!
  headerLeft: {
    position: "absolute",
    left: 8, // padding 때문에 살짝 왼쪽으로 붙임
    padding: 10, // 터치 영역(히트박스) 넓히기
    zIndex: 10, // 맨 앞으로 끄집어내기!
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  // ⭐ 여기도 zIndex와 padding 추가
  headerRight: {
    position: "absolute",
    right: 8,
    padding: 10,
    zIndex: 10,
  },
  saveText: { fontSize: 16, fontWeight: "600", color: "#2e78b7" },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: 250,
  },
  bottomBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 20,
    marginTop: "auto",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.48,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  actionButtonText: { fontSize: 14, color: "#666", fontWeight: "600" },
});
