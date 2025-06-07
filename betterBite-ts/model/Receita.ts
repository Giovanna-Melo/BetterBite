import { v4 as uuidv4 } from 'uuid';

export class Receita {
  public readonly id: string;

  constructor(
    public nome: string,
    public descricao: string,
    public imagemUrl: string,
    public ingredientes: string[],
    public preparo: string,
    public tempoPreparoMin: number,
    public porcoes: number,
    public caloriasPorPorcao: number,
    public proteinasPorPorcao: number,
    public gordurasPorPorcao: number,
    public fibrasPorPorcao: number
  ) {
    this.id = uuidv4();
  }
}