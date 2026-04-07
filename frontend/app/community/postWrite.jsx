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
      const API_URL = 'http://여기에_백엔드_IP주소_입력/api/posts/create';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        Alert.alert('성공', '게시글이 작성되었습니다!');
        navigation.reset({ index: 0, routes: [{ name: 'Community' }] });
      } else {
        Alert.alert('실패', '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('에러', '서버와 연결할 수 없습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate('Community');
          }}
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
