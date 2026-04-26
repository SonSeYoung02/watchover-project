import { useNavigation, useRoute } from '@react-navigation/native';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPost, updatePost } from '../api/communityApi';

export default function PostWrite() {
  const navigation = useNavigation();
  const route = useRoute();
  const { editPost } = route.params || {};

  const [title, setTitle] = useState(editPost?.title || '');
  const [content, setContent] = useState(editPost?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('에러', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const postData = { title, content };
      let result;
      if (editPost) {
        result = await updatePost(editPost.postId, postData, token);
        console.log('✅ 글수정 응답:', JSON.stringify(result, null, 2));
      } else {
        result = await createPost(postData, token);
        console.log('✅ 글쓰기 응답:', JSON.stringify(result, null, 2));
      }
      navigation.goBack();
    } catch (error) {
      console.log('❌ 처리 실패 상태 코드:', error.response?.status);
      if (error.response?.status === 403) {
        Alert.alert('권한 에러', '수정/등록 권한이 없습니다.');
      } else {
        Alert.alert('에러', '작업 중 문제가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editPost ? '글 수정' : '글 작성'}</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#5AA9E6" />
          ) : (
            <Text style={styles.saveText}>등록</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력하세요"
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  saveText: { fontSize: 16, fontWeight: '700', color: '#5AA9E6' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, flexGrow: 1 },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    paddingTop: 10,
    minHeight: 300,
  },
});
