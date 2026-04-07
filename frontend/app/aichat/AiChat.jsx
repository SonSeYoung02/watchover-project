import { useRouter } from "expo-router";
import { ChevronLeft, History, SendHorizontal } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
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

const AiChat = () => {
  const router = useRouter();
  const scrollViewRef = useRef();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "안녕하세요! 오늘 기분은 어떠신가요? 무엇이든 이야기해주세요.",
    },
  ]);

  // ✅ 새 메시지 추가 시 하단으로 자동 스크롤
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 시연용 가짜 응답
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          text: "이야기를 들어보니 마음이 조금 무거우셨겠어요. 제가 곁에 있을게요.",
        },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 챗봇</Text>

        {/* ✅ 경로 수정: /chat/history -> /aichat/ChatHistory */}
        <TouchableOpacity
          onPress={() => router.push("/aichat/ChatHistory")}
          style={styles.historyBtn}
        >
          <History color="#333" size={24} />
        </TouchableOpacity>
      </View>

      {/* 2. 채팅 메시지 영역 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatMessages}
        contentContainerStyle={styles.scrollContent}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.type === "user" ? styles.userRow : styles.aiRow,
            ]}
          >
            {msg.type === "ai" && (
              <View style={styles.aiAvatar}>
                <Text style={styles.avatarText}>AI</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                msg.type === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={msg.type === "user" ? styles.userText : styles.aiText}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 3. 하단 입력 영역 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.inputWrapper}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.inputField}
              value={input}
              onChangeText={setInput}
              placeholder="챗봇과 대화해보세요!"
              placeholderTextColor="rgba(255, 255, 255, 0.8)"
            />
            <TouchableOpacity onPress={handleSend}>
              <SendHorizontal size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerTitle: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
  },
  backBtn: { padding: 4 },
  historyBtn: { padding: 4 },
  chatMessages: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 20,
    maxWidth: "85%",
  },
  aiRow: {
    alignSelf: "flex-start",
  },
  userRow: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  aiAvatar: {
    width: 36,
    height: 36,
    backgroundColor: "#f1f3f5",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888888",
  },
  bubble: {
    padding: 12,
    paddingHorizontal: 16,
  },
  aiBubble: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  userBubble: {
    backgroundColor: "#4A90E2",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  aiText: {
    fontSize: 14,
    color: "#333333",
  },
  userText: {
    fontSize: 14,
    color: "#ffffff",
  },
  inputWrapper: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingBottom: Platform.OS === "ios" ? 20 : 20,
  },
  inputBar: {
    width: "100%",
    height: 50,
    backgroundColor: "#A3D2F3",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputField: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});
