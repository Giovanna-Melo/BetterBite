export class Desafio {
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
  ) {}
}
