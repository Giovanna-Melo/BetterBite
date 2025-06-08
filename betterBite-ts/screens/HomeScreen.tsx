import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/better-bite-logo.png')} 
        style={styles.logo}
        accessibilityLabel="Logo BetterBite"
      />
      <Text style={styles.title}>Bem-vindo(a) ao BetterBite!</Text>
      <Text style={styles.subtitle}>Sua jornada para uma alimentação saudável começa aqui.</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ListaDesafios')}
        >
          <Image
            source={require('../assets/desafios-logo.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Meus Desafios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Receitas')}
        >
          <Image
            source={require('../assets/receitas-logo.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Explorar Receitas</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Coma bem, viva melhor.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
  actionButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    tintColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    position: 'absolute',
    bottom: 30,
  },
});