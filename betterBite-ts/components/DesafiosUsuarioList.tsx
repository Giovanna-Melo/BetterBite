import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { Desafio } from '../model/Desafio';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type UserChallengesListProps = {
  desafiosDoUsuario: DesafioUsuario[];
  desafiosGerais: Desafio[];
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
};

export default function UserChallengesList({ desafiosDoUsuario, desafiosGerais, navigation }: UserChallengesListProps) {
  const getNomeDesafio = (desafioId: string): string => {
    const desafio = desafiosGerais.find(d => d.id === desafioId);
    return desafio ? desafio.nome : 'Desafio Desconhecido';
  };

  const renderDesafioParticipandoItem = ({ item }: { item: DesafioUsuario }) => {
    const desafioGeral = desafiosGerais.find(d => d.id === item.desafioId);
    let desafioIcon: any = 'star-outline';
    if (desafioGeral) {
        switch(desafioGeral.categoria) {
            case 'introdução alimentar':
              desafioIcon = 'leaf-outline';
              break;
            case 'refeições': 
                desafioIcon = 'restaurant-outline';
                break;
            case 'bem-estar':
                desafioIcon = 'happy-outline';
                break;
            case 'restrição':
                desafioIcon = 'alert-circle-outline';
                break;
            default:
                desafioIcon = 'star-outline';
        }
    }

    return (
      <TouchableOpacity
        style={styles.desafioParticipandoCard}
        onPress={() => navigation.navigate('DetalhesDesafio', { idDesafio: item.desafioId })}
      >
        <View style={styles.desafioIconPlaceholder}>
            <Ionicons name={desafioIcon} size={40} color="#8BC34A" />
        </View>
        
        <View style={styles.desafioParticipandoInfo}>
          <Text style={styles.desafioParticipandoTitle}>{getNomeDesafio(item.desafioId)}</Text>
          <Text style={styles.desafioParticipandoProgress}>Progresso: {Math.round(item.progresso)}%</Text>
          <Text style={styles.desafioParticipandoDays}>Status: {item.status === 'ativo' ? 'Ativo' : item.status === 'completo' ? 'Concluído' : 'Falhou'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#555" />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>🚀 Meus Desafios</Text>
      <FlatList
        data={desafiosDoUsuario}
        renderItem={renderDesafioParticipandoItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.desafiosParticipandoList}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Ionicons name="nutrition-outline" size={50} color="#CCC" />
            <Text style={styles.emptyListText}>Você não está participando de nenhum desafio. Que tal começar um novo?</Text>
            <TouchableOpacity
              style={styles.startChallengeButton}
              onPress={() => navigation.navigate('ListaDesafios')}
            >
              <Text style={styles.startChallengeButtonText}>Ver Desafios</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 20,
  },
  desafiosParticipandoList: {
    paddingBottom: 40,
  },
  desafioParticipandoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  desafioIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E6F4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  desafioParticipandoInfo: {
    flex: 1,
  },
  desafioParticipandoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  desafioParticipandoProgress: {
    fontSize: 14,
    color: '#666',
  },
  desafioParticipandoDays: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  emptyListContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyListText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  startChallengeButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  startChallengeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});