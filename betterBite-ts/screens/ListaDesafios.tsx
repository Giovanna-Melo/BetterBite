import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario'; 
import { DesafioController } from '../controllers/DesafioController'; 

type Props = NativeStackScreenProps<RootStackParamList, 'ListaDesafios'> & {
  desafios: Desafio[]; 
  registros: DesafioUsuario[]; 
};

export default function ListaDesafios({ navigation, desafios, registros }: Props) {
  const [loading, setLoading] = useState(true);
  const controller = new DesafioController(desafios, registros, []); 

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500); 
  }, []);

  const renderDesafioItem = ({ item }: { item: Desafio }) => {
    let desafioIcon: any = 'star-outline';
    switch(item.categoria) {
        case 'alimentacao':
            desafioIcon = 'restaurant-outline';
            break;
        case 'exercicio':
            desafioIcon = 'barbell-outline';
            break;
        case 'bem-estar':
            desafioIcon = 'happy-outline';
            break;
        default:
            desafioIcon = 'star-outline';
    }

    return (
      <TouchableOpacity
        style={styles.desafioCard}
        onPress={() => navigation.navigate('DetalhesDesafio', { idDesafio: item.id })}
      >
        <View style={styles.desafioCardIconPlaceholder}>
            <Ionicons name={desafioIcon} size={40} color="#689F38" />
        </View>
        <View style={styles.desafioCardInfo}>
          <Text style={styles.desafioCardTitle}>{item.nome}</Text>
          <Text style={styles.desafioCardDesc}>{item.descricao}</Text>
          <Text style={styles.desafioCardMeta}>
            Meta: {item.valorMeta} {item.unidade} por {item.frequencia} ({item.duracao} dias)
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#555" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.appLogoContainerList}>
          <Image
            source={require('../assets/better-bite-logo.png')}
            style={styles.appLogoMassive} 
            accessibilityLabel="BetterBite Logo"
          />
        </TouchableOpacity>
        
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonList}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Todos os Desafios</Text>
        <Image
          source={require('../assets/desafios-logo.png')} 
          style={styles.screenLogo}
          accessibilityLabel="Logo Desafios"
        />
      </View>

      <View style={styles.scrollableContentWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8BC34A" />
            <Text style={styles.loadingText}>Carregando desafios...</Text>
          </View>
        ) : (
          <FlatList
            data={desafios} 
            keyExtractor={(item) => item.id}
            renderItem={renderDesafioItem}
            showsVerticalScrollIndicator={true} 
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={50} color="#CCC" />
                <Text style={styles.emptyListText}>Nenhum desafio disponível no momento.</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingTop: 40, 
  },
  appLogoContainerList: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
  },
    appLogoMassive: { 
    width: 350, 
    height: 120, 
    resizeMode: 'contain',
  },
  backButtonList: {
    position: 'absolute',
    top: 15,
    right: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontSize: 17,
    color: '#333',
    marginLeft: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  screenLogo: { 
    width: 150,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollableContentWrapper: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  desafioCard: {
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
  desafioCardIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E6F4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  desafioCardInfo: {
    flex: 1,
  },
  desafioCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  desafioCardDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  desafioCardMeta: {
    fontSize: 12,
    color: '#888',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});