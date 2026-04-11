import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
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
// 통신 도구 불러오기
import client from '../api/client'; 

export default function WriteScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요!');
      return;
    }

    try {
      // 명세서 규칙: POST /api/community/post 
      // 보낼 데이터 구조 확인 필요 (userId 등)
      const response = await client.post('/api/community/post', {
        title: title,
        content: content,
        author: 'TestUser', // TODO: 나중에 실제 로그인한 유저명으로 교체
      });

      // 규칙: response.data.code === "SUCCESS" 확인
      if (response.data && response.data.code === "SUCCESS") {
        Alert.alert('성공', '게시글이 작성되었습니다!');
        // 작성 후 목록으로 돌아가서 새로고침 되도록 유도
        navigation.goBack(); 
      } else {
        Alert.alert('실패', response.data.message || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('글쓰기 에러:', error);
      Alert.alert('에러', '서버와 연결할 수 없습니다. IP 주소를 확인하세요.');
    }
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
        <Text style={styles.headerTitle}>글 작성</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>등록</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            maxLength={100}
          />
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
    flex: 1, backgroundColor: '#fff',
  },
  header: {
    height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eeeeee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111111' },
  saveBtn: { padding: 4 },
  saveText: { fontSize: 16, fontWeight: '700', color: '#5AA9E6' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40, flexGrow: 1 },
  titleInput: {
    fontSize: 22, fontWeight: 'bold', color: '#111', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 10,
  },
  contentInput: {
    flex: 1, fontSize: 16, color: '#333', lineHeight: 24,
    paddingTop: 10, paddingBottom: 20, minHeight: 300,
  },
});
