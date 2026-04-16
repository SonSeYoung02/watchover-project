import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, History, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 추가
import {
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { startChatRoom, sendChatMessage, finishAndSummarize } from '../api/chatApi';

const TypingIndicator = () => {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(450),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={typingStyles.row}>
      <View style={typingStyles.avatar}>
        <Text style={typingStyles.avatarText}>AI</Text>
      </View>
      <View style={typingStyles.bubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[typingStyles.dot, { transform: [{ translateY: dot }] }]} />
        ))}
      </View>
    </View>
  );
};

const typingStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 24 },
  avatar: {
    width: 38, height: 38, backgroundColor: '#E0F2FE', borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  avatarText: { fontSize: 11, fontWeight: '800', color: '#0EA5E9' },
  bubble: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', borderRadius: 22, borderTopLeftRadius: 4,
    paddingHorizontal: 18, paddingVertical: 14,
    borderWidth: 1, borderColor: '#F1F5F9', gap: 5,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#94A3B8' },
});

const AiChat = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [input, setInput] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [userToken, setUserToken] = useState(null); // 실제 토큰을 담을 곳
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: '안녕하세요! 오늘 기분은 어떠신가요? 무엇이든 이야기해주세요.' },
  ]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // 저장된 토큰 꺼내기
      if (token) {
        setUserToken(token);
        console.log("진짜 열쇠 가져옴:", token);
      }
    } catch (e) {
      console.error("토큰 로드 실패:", e);
    }
  };
  loadToken();
}, []);

  // 1. 메시지 전송 함수
const handleSend = async () => {
    if (!input.trim() || isWaiting) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsWaiting(true);

    try {
      let roomId = currentRoomId;
      
      // 방이 없으면 생성
      if (!roomId) {
        const roomRes = await startChatRoom(userToken);
        roomId = roomRes.data.chatRoomId;
        setCurrentRoomId(roomId);
      }

      // 메시지 전송
      const response = await sendChatMessage(roomId, currentInput, userToken);

      if (response && response.data) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, type: 'ai', text: response.data.answer },
        ]);
      }
    } catch (error) {
      // ... 에러 처리 ...
    } finally {
      setIsWaiting(false);
    }
  };

  // ✅ 3. 상담 종료 함수 수정
  // ✅ 수정된 상담 종료 함수
  const handleFinishChat = () => { // async 제거 (Alert 내부에서 비동기 처리)
    if (!currentRoomId) {
      Alert.alert("알림", "아직 대화 기록이 없습니다.");
      return;
    }

    Alert.alert(
      "상담 종료",
      "오늘의 대화를 마무리하고 감정을 기록할까요?",
      [
        { text: "취소", style: "cancel" },
        { 
          text: "종료", 
          onPress: async () => {
            try {
              setIsWaiting(true);
              const response = await finishAndSummarize(currentRoomId, userToken);
              
              if (response && response.code === "SUCCESS") {
                const todayEmotion = response.data.emotion || "평온";
                Alert.alert(
                  "기록 완료", 
                  `오늘 당신의 마음은 '${todayEmotion}'이었네요! 기록이 저장되었습니다.`, 
                  [{ text: "확인", onPress: () => navigation.navigate('Home') }]
                );
              }
            } catch (error) {
              console.error("감정 요약 실패:", error);
              Alert.alert("알림", "기록 중 오류가 발생했습니다.");
            } finally {
              setIsWaiting(false);
            }
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header - 종료 버튼 배치 수정 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 챗봇</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleFinishChat} style={styles.finishBtn}>
            <Text style={styles.finishText}>종료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatHistory')}
            style={styles.historyBtn}
          >
            <History color="#5AA9E6" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatMessages}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.messageRow, msg.type === 'user' ? styles.userRow : styles.aiRow]}
            >
              {msg.type === 'ai' && (
                <View style={styles.aiAvatar}>
                  <Text style={styles.avatarText}>AI</Text>
                </View>
              )}
              <View style={[
                styles.bubble,
                msg.type === 'user' ? styles.userBubble : styles.aiBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.type === 'user' ? styles.userText : styles.aiText
                ]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {isWaiting && <TypingIndicator />}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.inputField}
              value={input}
              onChangeText={setInput}
              placeholder={isWaiting ? '응답을 기다리는 중...' : '따뜻한 대화를 나눠보세요...'}
              placeholderTextColor="#94A3B8"
              multiline={true}
              editable={!isWaiting}
            />
            <TouchableOpacity
              onPress={handleSend}
              style={[styles.sendBtn, (!input.trim() || isWaiting) && styles.sendBtnDisabled]}
              disabled={!input.trim() || isWaiting}
            >
              {isWaiting
                ? <ActivityIndicator size="small" color="#ffffff" />
                : <Send size={20} color="#ffffff" />
              }
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiChat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  keyboardAvoidingView: { flex: 1 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#ffffff',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: { fontSize: 18, color: '#111111', fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  historyBtn: { padding: 4 },
  finishBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  finishText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  // ... 나머지 기존 스타일 코드 동일 ...
  chatMessages: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  messageRow: { flexDirection: 'row', marginBottom: 24, maxWidth: '85%' },
  aiRow: { alignSelf: 'flex-start' },
  userRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  aiAvatar: {
    width: 38, height: 38, backgroundColor: '#E0F2FE', borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  avatarText: { fontSize: 11, fontWeight: '800', color: '#0EA5E9' },
  bubble: {
    padding: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 1 },
    }),
  },
  aiBubble: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#F1F5F9', borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: '#5AA9E6', borderTopRightRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: '#334155', fontWeight: '500' },
  userText: { color: '#ffffff', fontWeight: '600' },
  inputWrapper: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: Platform.OS === 'ios' ? 8 : 10,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputField: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1E293B',
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#5AA9E6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: { backgroundColor: '#CBD5E1' },
});