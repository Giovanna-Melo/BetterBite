import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Notificacao } from '../model/Notificacao'; 

type NotificationCarouselProps = {
  notificacoes: Notificacao[]; 
};

export default function NotificationCarousel({ notificacoes }: NotificationCarouselProps) {
  const renderNotificacaoItem = ({ item }: { item: Notificacao }) => {
    let iconName: any = 'information-circle-outline';
    let backgroundColor = '#E0F2F7';

    switch (item.tipo) {
      case 'lembrete':
        iconName = 'time-outline';
        backgroundColor = '#FFFDE7';
        break;
      case 'alerta':
        iconName = 'alert-circle-outline';
        backgroundColor = '#FFEBEE';
        break;
      case 'novaMeta':
        iconName = 'trophy-outline';
        backgroundColor = '#E8F5E9';
        break;
    }

    return (
      <View style={[styles.notificacaoCard, { backgroundColor: backgroundColor }]}>
        <Ionicons name={iconName} size={24} color="#333" style={styles.notificacaoIcon} />
        <View style={styles.notificacaoContent}>
          <Text style={styles.notificacaoText}>{item.texto}</Text>
          <Text style={styles.notificacaoTime}>{item.horarioAgendado.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>🔔 Notificações & Lembretes</Text>
      {notificacoes.length > 0 ? (
        <FlatList
          data={notificacoes}
          renderItem={renderNotificacaoItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.notificacoesCarousel}
        />
      ) : (
        <View style={styles.noNotificacoesContainer}>
          <Text style={styles.noNotificacoesText}>Nenhuma notificação nova.</Text>
        </View>
      )}
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
  notificacoesCarousel: {
    paddingRight: 20, 
  },
  notificacaoCard: {
    width: 280,
    minHeight: 80,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificacaoIcon: {
    marginRight: 10,
  },
  notificacaoContent: {
    flex: 1,
  },
  notificacaoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notificacaoTime: {
    fontSize: 12,
    color: '#666',
  },
  noNotificacoesContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginRight: 20, 
  },
  noNotificacoesText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});