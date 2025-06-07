import { v4 as uuidv4 } from 'uuid';

export class RegistroDesafio {
  public readonly id: string;

  constructor(
    public idDesafio: string,  // ID do desafio associado
    public data: Date,       // ex: '2025-06-07'
    public cumpriuMeta: boolean,
    public observacao?: string
  ) {
    this.id = uuidv4();
  }
}