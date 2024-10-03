import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Inicial from '../screens/authentication/inicial';
import Login from '../screens/authentication/login';
import Cadastro from '../screens/authentication/cadastro';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/appScreens/home';
import Calendario from '../screens/appScreens/calendario';
import Adote from '../screens/appScreens/adote';
import Perfil from '../screens/appScreens/perfil';
import Fonts from '../utils/Fonts';
import Recuperarsenha from '../screens/authentication/recuperarsenha/Recuperarsenha';
import AdicionarPet from '../screens/appScreens/AdicionarPet';
import Pets from '../screens/appScreens/pets';
import Favoritos from '../screens/appScreens/favoritos';
import Chat from '../screens/appScreens/Chat';
import ChatList from '../screens/appScreens/ChatList';
import ChatPessoal from '../screens/appScreens/ChatPessoal';
import AdotarPet from '../screens/appScreens/AdotarPet';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicial" component={Inicial} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Recuperarsenha" component={Recuperarsenha} />
      <Stack.Screen name="Pets" component={Pets} />
      <Stack.Screen name="AdicionarPet" component={AdicionarPet} />
      <Stack.Screen name="Favoritos" component={Favoritos} />
      <Stack.Screen name="TabBar" component={TabBar} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatPessoal" component={ChatPessoal} />
      <Stack.Screen name="AdotarPet" component={AdotarPet} />
    </Stack.Navigator>
  );
}

function TabBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#593C9D",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused, color }) => {
          const iconSize = 30; // Define um tamanho fixo para todos os ícones
          let iconName;

          switch (route.name) {
            case "home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "calendário":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "adote":
              iconName = focused ? "paw" : "paw-outline";
              break;
            case "perfil":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home"; 
          }

          return <Ionicons name={iconName} color={color} size={iconSize} />;
        },
        tabBarIconStyle: { marginBottom: -10 },
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, { fontFamily: Fonts['poppins-regular'], color: focused ? "#593C9D" : "#000" }]}>
            {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="calendário"
        component={Calendario}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="adote"
        component={Adote}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="perfil"
        component={Perfil}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "white",
    height: 60,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 12,
  },
});
