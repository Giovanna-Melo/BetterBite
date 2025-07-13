import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { dbService } from '../database/DatabaseService';
import { Notificacao } from '../model/Notificacao';
import { Usuario } from '../model/Usuario';
import { generateUUID } from '../utils/uuidGenerator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificacaoController {

  public async registerForPushNotificationsAsync(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('As notificações são necessárias para os lembretes dos desafios!');
      return false;
    }
    return true;
  }

  public async criarLembretesDeDesafio(
    desafioNome: string,
    desafioId: string,
    usuario: Usuario,
    dataInicio: Date,
    duracaoDias: number
  ): Promise<void> {
    const temPermissao = await this.registerForPushNotificationsAsync();
    if (!temPermissao) return;

    const agora = new Date();

    for (let i = 0; i < duracaoDias; i++) {
      const dataLembrete = new Date(dataInicio);
      dataLembrete.setDate(dataInicio.getDate() + i);
      dataLembrete.setHours(20, 0, 0);

      if (dataLembrete > agora) {
        const textoNotificacao = `Lembrete: registe o seu progresso no desafio "${desafioNome}"!`;

        const novaNotificacaoDB = new Notificacao(
          usuario.id,
          textoNotificacao,
          dataLembrete,
          'lembrete',
          false
        );
        (novaNotificacaoDB as any).id = generateUUID();
        await dbService.addNotificacao(novaNotificacaoDB);

        if (Platform.OS !== 'web') {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Lembrete de Desafio! 🚀",
              body: textoNotificacao,
              data: { desafioId },
            },
            trigger: {
            type: 'date',
            date: dataLembrete,
            },
          });
        }

      }
    }
    console.log(`${duracaoDias} notificações agendadas e salvas para o desafio '${desafioNome}'.`);
  }
}