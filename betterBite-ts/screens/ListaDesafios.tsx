import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { Desafio } from '../model/Desafio';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  desafios: Desafio[];
}

type RootStackParamList = {
  DetalhesDesafio: { idDesafio: string };
  CriarDesafio: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ListaDesafios({ desafios }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState<Desafio[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLista(desafios);
      setLoading(false);
    }, 1000);
  }, [desafios]);

  const desafiosFiltrados = lista.filter(d =>
    d.nome.toLowerCase().includes(filtro.toLowerCase())
  );

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

        <Text style={styles.title}>Desafios Ativos</Text>

        <Image
          source={require('../assets/desafios-logo.png')}
          style={styles.screenLogo}
          accessibilityLabel="Logo Desafios"
        />

        <TextInput
          style={styles.input}
          placeholder="Buscar desafio..."
          placeholderTextColor="#999"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      <View style={styles.listWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Carregando desafios...</Text>
          </View>
        ) : (
          <FlatList
            data={desafiosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemBox}
                onPress={() => navigation.navigate('DetalhesDesafio', { idDesafio: item.id })}
              >
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Ionicons name="chevron-forward" size={24} color="#888" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={50} color="#CCC" />
                <Text style={styles.emptyListText}>Nenhum desafio encontrado.</Text>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CriarDesafio')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // mantém os estilos anteriores
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
  },
  appLogoContainerList: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  appLogoContainer: {
    // Mantido para consistência
  },
  appLogoMassive: { // AINDA MAIOR
    width: 300, // Aumentado significativamente
    height: 100, // Aumentado significativamente
    resizeMode: 'contain',
  },
  backButton: {
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
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#444',
    width: '100%',
    maxWidth: 400,
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  itemBox: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
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
