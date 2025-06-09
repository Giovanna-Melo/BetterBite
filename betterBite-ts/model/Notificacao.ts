import { v4 as uuidv4 } from 'uuid';

export class Notificacao {
  public readonly id: string;

  constructor(
    public usuarioId: string,
    public texto: string,
    public horarioAgendado: Date,
    public tipo: 'lembrete' | 'alerta' | 'novaMeta',
    public lida: boolean
  ) {
    this.id = uuidv4();
  }
}