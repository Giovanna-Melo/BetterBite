import { generateUUID } from '../utils/uuidGenerator'; 

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
    this.id = generateUUID();
  }
}