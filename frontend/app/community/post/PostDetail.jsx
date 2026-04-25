import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MoreVertical, Heart, MessageCircle, Send, User } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPostDetail, registerComment } from '../../api/communityApi';

export default function PostDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        console.log('📄 상세 요청 postId:', id, '/ 타입:', typeof id);
        const result = await getPostDetail(id, token);
        console.log('📄 게시글 상세 응답:', JSON.stringify(result, null, 2));
        if (result && result.code === "SUCCESS" && result.data) {
          setPost(result.data);
          setComments(result.data.comments || result.data.commentList || []);
        }
      } catch (error) {
        console.error('상세보기 로드 실패:', error);
        Alert.alert('에러', '게시글을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPostDetail();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await registerComment(id, commentText, token);
      if (result && result.code === "SUCCESS") {
        setComments([...comments, result.data]);
        setCommentText('');
      }
    } catch (error) {
      Alert.alert('실패', '댓글 등록 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#5AA9E6" />
      </View>
    );
  }

  if (!post) return null;

  // ... 이하 UI 렌더링 코드는 기존과 동일 ...

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreVertical color="#333" size={24} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Post Content Area */}
          <View style={styles.postHeader}>
            <View style={styles.authorInfo}>
              <View style={styles.avatar}>
                <User color="#ffffff" size={20} />
              </View>
              <View>
                <Text style={styles.authorName}>{post.nickname || post.author || '익명'}</Text>
                <Text style={styles.postDate}>{post.createdAt ? post.createdAt.split('T')[0] : ''}</Text>
              </View>
            </View>
          </View>

          <View style={styles.postBody}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>

          <View style={styles.actionBar}>
            <View style={styles.actionBtn}>
              <MessageCircle color="#5AA9E6" size={22} />
              <Text style={[styles.actionText, { color: '#5AA9E6' }]}>{comments.length}</Text>
            </View>
            <View style={styles.actionBtn}>
              <Heart color="#FF5A5F" size={22} />
              <Text style={[styles.actionText, { color: '#FF5A5F' }]}>{post.likeCount || 0}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Comments List (좋아요 기능 삭제) */}
          <View style={styles.commentSection}>
            <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
            {comments.map((comment, index) => (
              <View key={comment.id || index} style={styles.commentItem}>
                <View style={[styles.avatar, styles.commentAvatar]}>
                  <User color="#ffffff" size={16} />
                </View>
                <View style={styles.commentBody}>
                  <View style={styles.commentAuthorRow}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentTime}>{comment.createdAt || '방금 전'}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.content || comment.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Sticky Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="따뜻한 댓글을 남겨주세요..."
            placeholderTextColor="#bbbbbb"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleCommentSubmit}>
            <Send color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

