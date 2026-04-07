import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MoreVertical, Heart, MessageCircle, Bookmark, Send, User } from 'lucide-react-native';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  // Mock post data based on context
  const post = {
    id: id || '1',
    title: '제가 오늘 겪은 감정에 대해서 이야기해볼까요?',
    content: '요즘 밤낮이 바뀌어서 그런지 감정 기복이 조금 심해진 것 같아요.\n하지만 워치오버 앱으로 매일 일기를 쓰면서 나 자신을 되돌아보는 시간을 가질 수 있어서 다행이에요.\n\n다른 분들은 스트레스 받을 때 어떻게 마인드컨트롤 하시나요? 좋은 팁이 있다면 공유해주세요!',
    author: '익명의 별',
    createdAt: '2024-05-18 14:30',
    likes: 24,
    bookmarks: 5,
    views: 128,
  };

  const comments = [
    { id: 1, author: '잔잔한 호수', text: '저도 요즘 불면증 때문에 힘들었는데 공감되네요. 따뜻한 차 한잔 마시면서 일기 쓰면 좀 낫더라고요!', createdAt: '2시간 전' },
    { id: 2, author: '새벽 감성', text: '너무 자책하지 마세요. 누구나 그런 시기가 있는 법이랍니다. 파이팅!', createdAt: '1시간 전' },
    { id: 3, author: '행복한 고양이', text: '저는 산책을 주로 해요. 바깥 공기를 쐬면 머리가 한결 맑아지거든요.', createdAt: '30분 전' },
  ];

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
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Post Header */}
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

          {/* Post Content */}
          <View style={styles.postBody}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionBtn}>
              <MessageCircle color="#5AA9E6" size={22} />
              <Text style={[styles.actionText, { color: '#5AA9E6' }]}>{comments.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Heart color="#FF5A5F" size={22} />
              <Text style={[styles.actionText, { color: '#FF5A5F' }]}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Bookmark color="#FFD700" size={22} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Comments Section */}
          <View style={styles.commentSection}>
            <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={[styles.avatar, styles.commentAvatar]}>
                  <User color="#ffffff" size={16} />
                </View>
                <View style={styles.commentBody}>
                  <View style={styles.commentAuthorRow}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentTime}>{comment.createdAt}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input Sticky Footer */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="따뜻한 댓글을 남겨주세요..."
            placeholderTextColor="#bbbbbb"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Send color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  keyboardView: { flex: 1 },
  header: {
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111111' },
  iconBtn: { padding: 4 },
  scrollContent: { paddingBottom: 40 },
  
  postHeader: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15,
  },
  authorInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#5AA9E6',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  authorName: { fontSize: 16, fontWeight: '700', color: '#333333', marginBottom: 2 },
  postDate: { fontSize: 13, color: '#888888' },
  
  postBody: { paddingHorizontal: 20, paddingBottom: 20 },
  postTitle: { fontSize: 22, fontWeight: '800', color: '#111111', marginBottom: 16, lineHeight: 30 },
  postContent: { fontSize: 16, color: '#444444', lineHeight: 26 },
  
  actionBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20,
    gap: 16,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 15, color: '#333333', fontWeight: '500' },
  
  divider: { height: 8, backgroundColor: '#F8F9FA' },
  
  commentSection: { paddingHorizontal: 20, paddingTop: 20 },
  commentHeader: { fontSize: 16, fontWeight: '700', color: '#111111', marginBottom: 16 },
  commentItem: { flexDirection: 'row', marginBottom: 24 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#A5D3F5' },
  commentBody: { flex: 1 },
  commentAuthorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { fontSize: 14, fontWeight: '700', color: '#333333' },
  commentTime: { fontSize: 12, color: '#999999' },
  commentText: { fontSize: 15, color: '#555555', lineHeight: 22 },

  inputContainer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#ffffff',
  },
  textInput: {
    flex: 1, backgroundColor: '#F8F9FA', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: '#333333', maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#5AA9E6',
    justifyContent: 'center', alignItems: 'center', marginLeft: 12,
  },
});
