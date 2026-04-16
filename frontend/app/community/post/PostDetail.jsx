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
// ✅ 변경: 직접 client 대신 communityApi 함수들 임포트
import { getPostDetail, registerComment } from '../../api/communityApi'; 

export default function PostDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 1. 게시글 상세 조회 로직 수정
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsLoading(true);
        const result = await getPostDetail(id); // API 함수 호출
        
        if (result && result.code === "SUCCESS" && result.data) {
          setPost(result.data);
          setComments(result.data.comments || []);
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

  // ✅ 2. 댓글 등록 함수 수정
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const result = await registerComment({
        postId: id,
        content: commentText,
        author: 'TestUser' // 나중에 로그인한 사용자 닉네임으로 교체
      });

      if (result && result.code === "SUCCESS") {
        // 서버에서 생성된 새 댓글 객체를 즉시 리스트에 반영
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
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postDate}>{post.createdAt}</Text>
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
              <Text style={[styles.actionText, { color: '#FF5A5F' }]}>{post.likes || 0}</Text>
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

