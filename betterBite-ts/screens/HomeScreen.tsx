import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ BetterBite</Text>
      <Text style={styles.subtitle}>Seu aliado para hábitos saudáveis</Text>

      <Button title="Ver Desafios" onPress={() => navigation.navigate('ListaDesafios')} />
      <Button title="Ver Receitas" onPress={() => navigation.navigate('Receitas')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 30, color: '#555', textAlign: 'center' }
});