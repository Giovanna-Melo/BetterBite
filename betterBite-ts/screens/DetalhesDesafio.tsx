import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';
import { DesafioController } from '../controllers/DesafioController';
import { RootStackParamList } from '../App';

interface Props {
  desafios: Desafio[];
  registros: DesafioUsuario[];
  registrosDesafio: RegistroDesafio[];
}

type RouteParams = {
  DetalhesDesafio: {
    idDesafio: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetalhesDesafio'>;

export default function DetalhesDesafio({ desafios, registros, registrosDesafio }: Props) {
  const route = useRoute<RouteProp<RouteParams, 'DetalhesDesafio'>>();
  const navigation = useNavigation<NavigationProp>();

  const controller = new DesafioController(desafios, registros, registrosDesafio);
  const desafio = controller.buscarPorId(route.params.idDesafio);

  if (!desafio) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Desafio não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progresso = controller.progressoPorDesafio(desafio.id);
  const registrosLista = controller.registrosDoDesafio(desafio.id);

  // Encontrar o registro do usuário ativo para esse desafio (se existir)
  const registroUsuario = registros.find(r => r.desafioId === desafio.id);

  function irParaCriarRegistro() {
    navigation.navigate('CriarRegistroDesafio', { idDesafio: desafio.id });
  }

  // Agrupar registros por data e somar consumo
  const registrosPorData = Array.from(
    registrosLista.reduce((acc, reg) => {
      const dataStr = reg.data.toISOString().split('T')[0]; // yyyy-mm-dd
      const total = acc.get(dataStr) ?? 0;
      acc.set(dataStr, total + reg.consumo);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => (a[0] < b[0] ? 1 : -1)); // ordena por data desc

  // Formata datas de início e fim do usuário
  const dataInicioFormatada = registroUsuario?.dataInicio
    ? registroUsuario.dataInicio.toLocaleDateString()
    : 'N/A';
  const dataFimFormatada = registroUsuario?.dataFim
    ? registroUsuario.dataFim.toLocaleDateString()
    : 'N/A';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{desafio.nome}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Descrição */}
        <Text style={styles.desc}>{desafio.descricao}</Text>

        {/* Dados do Desafio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Desafio</Text>
          <Text style={styles.infoText}>
  {`Meta de ${desafio.valorMeta} ${desafio.unidade} ${desafio.frequencia}, por ${desafio.duracao} dias.`}
</Text>

        </View>

        {/* Dados do usuário no desafio */}
        {registroUsuario && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datas</Text>
            <Text style={styles.infoText}>Início: {dataInicioFormatada}</Text>
            <Text style={styles.infoText}>Fim: {dataFimFormatada}</Text>
          </View>
        )}

        {/* Barra de progresso geral */}
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>Progresso Geral:</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progresso}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{progresso}%</Text>
        </View>

        {/* Registros por dia */}
        <Text style={styles.subtitle}>Registros por dia:</Text>
        {registrosPorData.length === 0 ? (
          <Text style={styles.semRegistro}>Nenhum registro ainda.</Text>
        ) : (
          registrosPorData.map(([dataStr, totalConsumo]) => (
            <View key={dataStr} style={styles.registroItem}>
              <Text style={styles.registroText}>
                {new Date(dataStr).toLocaleDateString()} - {totalConsumo} {desafio.unidade} →
              </Text>
              <Text style={{ color: totalConsumo >= desafio.valorMeta ? '#4CAF50' : '#D32F2F' }}>
                {totalConsumo >= desafio.valorMeta ? '✅ Cumprido' : '❌ Não cumprido'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={irParaCriarRegistro}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingRight: 10,
  },

  backButtonText: {
    fontSize: 17,
    color: '#333',
    marginLeft: 5,
  },

  detailTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 40, // para compensar o espaço do botão voltar
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  desc: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },

  section: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },

  infoText: {
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },

  progressBox: {
    marginBottom: 24,
    paddingHorizontal: 12,
  },

  progressText: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },

  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#EEE',
    borderRadius: 7,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },

  progressPercent: {
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  semRegistro: {
    fontStyle: 'italic',
    color: '#999',
  },

  registroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },

  registroText: {
    fontSize: 15,
    color: '#444',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
