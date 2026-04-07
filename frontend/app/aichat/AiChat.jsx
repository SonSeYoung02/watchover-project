import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, History, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
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
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: '안녕하세요! 오늘 기분은 어떠신가요? 무엇이든 이야기해주세요.' },
  ]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isWaiting) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsWaiting(true);

    // AI Response Mockup
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          text: '이야기를 들어보니 마음이 조금 무거우셨겠어요. 제가 곁에서 여러분의 이야기를 경청하고 응원할게요.'
        },
      ]);
      setIsWaiting(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header - Standard Premium Style */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 챗봇</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatHistory')}
          style={styles.historyBtn}
        >
          <History color="#5AA9E6" size={24} />
        </TouchableOpacity>
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

        {/* Modern Floating Input Area */}
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
  backBtn: { padding: 4 },
  historyBtn: { padding: 4 },

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
  aiBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#5AA9E6',
    borderTopRightRadius: 4,
  },

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
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
