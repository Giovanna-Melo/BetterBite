import React, { useEffect, useState } from 'react';
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
import { Receita } from '../model/Receita';
import { ReceitaController } from '../controllers/ReceitaController';
import ReceitaCard from '../components/ReceitaCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'Receitas'>;

export default function ReceitasScreen({ navigation }: Props) {
  const controller = new ReceitaController();
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [filtro, setFiltro] = useState<string>('');
  const [selecionada, setSelecionada] = useState<Receita | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const todas = controller.listarTodas();
      setReceitas(todas);
      console.log('Número de receitas carregadas:', todas.length);
      setLoading(false);
    }, 1000);
  }, []);

  const receitasFiltradas = receitas.filter((r) =>
    r.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    r.ingredientes.some((ing) => ing.toLowerCase().includes(filtro.toLowerCase()))
  );

  // Se uma receita estiver selecionada, mostra o card detalhado
  if (selecionada) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.appLogoContainer}>
            <Image
              source={require('../assets/better-bite-logo.png')}
              style={styles.appLogoMassive} // Mantendo o estilo da logo maior
              accessibilityLabel="BetterBite Logo"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelecionada(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        <ReceitaCard receita={selecionada} />
      </SafeAreaView>
    );
  }

  // Caso contrário, mostra a lista de receitas
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.appLogoContainerList}>
            <Image
              source={require('../assets/better-bite-logo.png')}
              style={styles.appLogoMassive} // Mantendo o estilo da logo maior
              accessibilityLabel="BetterBite Logo"
            />
        </TouchableOpacity>
        <Text style={styles.title}>Receitas Saudáveis</Text>
        <Image
          source={require('../assets/receitas-logo.png')}
          style={styles.screenLogo}
          accessibilityLabel="Logo Receitas"
        />
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome ou ingrediente..."
          placeholderTextColor="#999"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      <View style={styles.scrollableContentWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8BC34A" />
            <Text style={styles.loadingText}>Carregando receitas...</Text>
          </View>
        ) : (
          <FlatList
            data={receitasFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemBox} onPress={() => setSelecionada(item)}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.nome}</Text>
                  {item.caloriasPorPorcao && (
                    <Text style={styles.itemCalories}>
                      🔥 {item.caloriasPorPorcao} kcal por porção
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={24} color="#888" />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={true} // ALTERADO PARA TRUE PARA MANTER A BARRINHA DE ROLAGEM
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={50} color="#CCC" />
                <Text style={styles.emptyListText}>Nenhuma receita encontrada.</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
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
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemCalories: {
    fontSize: 14,
    color: '#777',
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