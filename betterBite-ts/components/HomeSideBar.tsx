import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Usuario } from '../model/Usuario';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeSidebarProps = {
  usuario: Usuario;
  setUsuario: (usuario: Usuario | null) => void;
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  activeMenu: 'desafios' | 'receitas' | null;
  setActiveMenu: (menu: 'desafios' | 'receitas' | null) => void;
  onLogout: () => void;
};

export default function HomeSidebar({ usuario, setUsuario, navigation, activeMenu, setActiveMenu, onLogout }: HomeSidebarProps) {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.sidebarIcon} onPress={() => navigation.navigate('EditarUsuario')}>
        <Image
          source={require('../assets/receitas-logo.png')}
          style={styles.avatarImage}
        />
        <Text style={styles.userNameText}>{usuario.nome.split(' ')[0]}</Text>
      </TouchableOpacity>

      <View style={styles.sidebarNav}>
        <TouchableOpacity
          style={[styles.sidebarNavItem, activeMenu === 'desafios' && styles.sidebarNavItemActive]}
          onPress={() => {
            setActiveMenu('desafios');
            navigation.navigate('ListaDesafios');
          }}
        >
          <Image
            source={require('../assets/desafios-logo.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Desafios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sidebarNavItem, activeMenu === 'receitas' && styles.sidebarNavItemActive]}
          onPress={() => {
            setActiveMenu('receitas');
            navigation.navigate('Receitas');
          }}
        >
          <Image
            source={require('../assets/receitas-logo.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Receitas</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.logoutButton} 
        onPress={() => {
          onLogout();
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="#FF6347" /> 
        <Text style={styles.logoutButtonText}>Sair</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'space-between',
  },
  sidebarIcon: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  sidebarNav: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  sidebarNavItem: {
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    marginBottom: 10,
  },
  sidebarNavItemActive: {
    backgroundColor: '#E6F4E6',
    borderRadius: 10,
  },
  navIcon: {
    width: 60,
    height: 60,
  },
  navText: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    fontWeight: 'bold',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 12,
    color: '#FF6347', 
    marginTop: 5,
    fontWeight: 'bold',
  },
});