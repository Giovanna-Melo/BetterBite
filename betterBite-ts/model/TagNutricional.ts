import { v4 as uuidv4 } from 'uuid';

export class TagNutricional {
  public readonly id: string;

  constructor(
    public nome: string
  ) {
    this.id = uuidv4();
  }
}

export class ReceitaTag {
  public readonly id: string;

  constructor(
    public receitaId: string,
    public tagId: string
  ) {
    this.id = uuidv4();
  }
}