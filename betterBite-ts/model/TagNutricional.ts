import { generateUUID } from '../utils/uuidGenerator'; 

export class TagNutricional {
  public readonly id: string;

  constructor(
    public nome: string
  ) {
    this.id = generateUUID();
  }
}

export class ReceitaTag {
  public readonly id: string;

  constructor(
    public receitaId: string,
    public tagId: string
  ) {
    this.id = generateUUID();
  }
}