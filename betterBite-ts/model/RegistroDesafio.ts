import { generateUUID } from '../utils/uuidGenerator'; 

export class RegistroDesafio {
  public readonly id: string;

  constructor(
    public desafioUsuarioId: string,
    public data: Date,
    public consumo: number,
    public observacao?: string
  ) {
    this.id = generateUUID();
  }
}