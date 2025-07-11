import { generateUUID } from '../utils/uuidGenerator'; 

export class DesafioUsuario {
  public readonly id: string;

  constructor(
    public usuarioId: string,
    public desafioId: string,
    public dataInicio: Date,
    public dataFim: Date,
    public status: 'ativo' | 'completo' | 'falhou',
    public progresso: number
  ) {
    this.id = generateUUID();
  }
}