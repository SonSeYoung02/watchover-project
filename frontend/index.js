import {AppRegistry} from 'react-native';
// 확장자 .jsx까지 확실히 붙여주는 게 안전
import AppNavigator from './app/AppNavigator.jsx'; 

// 'main'을 'watchover'로 수정 (app.json의 name과 일치)
AppRegistry.registerComponent('main', () => AppNavigator);