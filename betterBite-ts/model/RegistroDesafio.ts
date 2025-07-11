import { generateUUID } from '../utils/uuidGenerator'; 

export class RegistroDesafio {
  public readonly id: string;

  constructor(
    public idDesafio: string,  // ID do desafio associado
    public data: Date,       // ex: '2025-06-07'
    public consumo: number,
    public observacao?: string
  ) {
    this.id = generateUUID();
  }
}