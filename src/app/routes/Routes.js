import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Inicial from '../screens/authentication/inicial';
import Login from '../screens/authentication/login';
import Cadastro from '../screens/authentication/cadastro';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import Home from '../screens/appScreens/home';
import Calendario from '../screens/appScreens/calendario';
import Adote from '../screens/appScreens/adote';
import Perfil from '../screens/appScreens/perfil';
import { StyleSheet } from 'react-native';
import Fonts from '../utils/Fonts';
import { Ionicons } from '@expo/vector-icons';
import Recuperarsenha from '../screens/authentication/recuperarsenha/Recuperarsenha';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="Inicial" component={Inicial} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="Recuperarsenha" component={Recuperarsenha} />
            <Stack.Screen name="TabBar" component={TabBar} />

        </Stack.Navigator>
  )
}

function TabBar() {
    return (
        <Tab.Navigator

        screenOptions={({ route }) => ({
            tabBarActiveTintColor: "#593C9D",
            tabBarInactiveTintColor: "#000",
            tabBarStyle: styles.tabBarStyle,
            tabBarIcon: ({ focused, color }) => {
              const iconSize = 30; // Definindo um tamanho fixo para todos os ícones
              if (route.name === "home") {
                return <Ionicons name={focused ? "home" : "home-outline"} color={color} size={iconSize} />;
              } else if (route.name === "calendario") {
                return <Ionicons name={focused ? "calendar" : "calendar-outline"} color={color} size={iconSize} />;
              } else if (route.name === "adote") {
                return <Ionicons name={focused ? "paw" : "paw-outline"} color={color} size={iconSize} />;
              } else if (route.name === "perfil") {
                return <Ionicons name={focused ? "person" : "person-outline"} color={color} size={iconSize} />;
              }
            },
            tabBarIconStyle: { marginBottom: -10 },
          })}
        >
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    title: "Home",
                    headerShown: false,
                    headerShadowVisible: false,
                    headerTitleStyle: { fontSize: 24, fontWeight: "bold" },
                    headerTitleContainerStyle: { marginTop: 20, marginLeft: 30 },
                  }}
            />

            <Tab.Screen
                name="calendario"
                component={Calendario}
                options={{
                    title: "Calendario",
                    headerShown: false,
                    headerShadowVisible: false,
                    headerTitleStyle: { fontSize: 24, fontWeight: "bold" },
                    headerTitleContainerStyle: { marginTop: 20, marginLeft: 30 },
                  }}
            />
            <Tab.Screen
                name="adote"
                component={Adote}
                options={{
                    title: "Adote",
                    headerTitleStyle: { fontSize: 24, fontWeight: "bold" },
                    headerTitleContainerStyle: { marginTop: 20, marginLeft: 30 },
                  }}
            />

            <Tab.Screen
                name="perfil"
                component={Perfil}
                options={{
                    title: "Perfil",
                    headerShown: false,
                    headerShadowVisible: false,
                    headerTitleStyle: { fontSize: 24, fontWeight: "bold" },
                    headerTitleContainerStyle: { marginTop: 20, marginLeft: 30 },
                  }}
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
  });