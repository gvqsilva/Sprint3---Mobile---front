import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // 🌟 Importação do Stack
import { Ionicons } from '@expo/vector-icons'; 

import HomeScreen from './src/screens/HomeScreen';
import PesquisaScreen from './src/screens/PesquisaScreen';
import CopilotoScreen from './src/screens/CopilotoScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import RadarScreen from './src/screens/RadarScreen'; // Tela Oculta

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // 🌟 Novo roteador global

const FORD_COLORS = { bluePrimary: '#003882', grayShiny: '#9CA3AF', white: '#FFFFFF' };

// 🌟 Menu Inferior agora isolado
function TabRoutes() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Pesquisa') iconName = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'Copiloto') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
        tabBarActiveTintColor: FORD_COLORS.bluePrimary,
        tabBarInactiveTintColor: FORD_COLORS.grayShiny,
        tabBarStyle: { height: 65, paddingBottom: 8, paddingTop: 8, elevation: 10, shadowOpacity: 0.05 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Pesquisa" component={PesquisaScreen} options={{ tabBarLabel: 'Análise' }} />
      <Tab.Screen name="Copiloto" component={CopilotoScreen} options={{ tabBarLabel: 'Copiloto' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: 'Cofre' }} />
    </Tab.Navigator>
  );
}

// 🌟 App Principal com o Stack
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* As 4 abas normais */}
        <Stack.Screen name="MainTabs" component={TabRoutes} />
        {/* A tela secreta do Radar, que só abre via botão */}
        <Stack.Screen name="Radar" component={RadarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}