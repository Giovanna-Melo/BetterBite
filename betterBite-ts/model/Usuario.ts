import { v4 as uuidv4 } from 'uuid';

export class Usuario {
  public readonly id: string;

  constructor(
    public nome: string,
    public email: string,
    public senhaHash: string,
    public dataNascimento: Date,
    public genero: 'masculino' | 'feminino' | 'outro',
    public peso: number,
    public altura: number,
    public restricoesAlimentares: string[]
  ) {
    this.id = uuidv4();
  }
}