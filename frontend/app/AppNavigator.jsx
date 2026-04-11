import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from './auth/Login';
import Signup from './auth/Signup';
import Home from './home/index';
import Quotes from './home/quotes';
import AiChat from './aichat/AiChat';
import ChatHistory from './aichat/ChatHistory';
import ChatDetail from './aichat/ChatDetail';
import Calendar from './calendar/calendar';
import Character from './character/index';
import CharacterCreate from './character/create';
import CharacterResult from './character/result';
import Community from './community/index';
import PostDetail from './community/post/PostDetail';
import PostWrite from './community/postWrite';
import Mypage from './mypage/Mypage';

axios.defaults.baseURL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F9F9F9' },
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Quotes" component={Quotes} />
          <Stack.Screen name="AiChat" component={AiChat} />
          <Stack.Screen name="ChatHistory" component={ChatHistory} />
          <Stack.Screen name="ChatDetail" component={ChatDetail} />
          <Stack.Screen name="Calendar" component={Calendar} />
          <Stack.Screen name="Character" component={Character} />
          <Stack.Screen name="CharacterCreate" component={CharacterCreate} />
          <Stack.Screen name="CharacterResult" component={CharacterResult} />
          <Stack.Screen name="Community" component={Community} />
          <Stack.Screen name="PostDetail" component={PostDetail} />
          <Stack.Screen name="PostWrite" component={PostWrite} />
          <Stack.Screen name="Mypage" component={Mypage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
