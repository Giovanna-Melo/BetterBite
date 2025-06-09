import { v4 as uuidv4 } from 'uuid';

export class Desafio {
  public readonly id: string;

  constructor(
    public nome: string,
    public descricao: string,
    public categoria: string,
    public tipoMeta: string,
    public unidade: string,
    public valorMeta: number,
    public frequencia: string,
    public duracao: number,
    public ehPersonalizavel: boolean,
    public ativo: boolean
  ) {
    this.id = uuidv4();
  }
}