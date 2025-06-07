import { v4 as uuidv4 } from 'uuid';

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
    this.id = uuidv4();
  }
}