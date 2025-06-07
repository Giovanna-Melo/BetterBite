export class RegistroDesafio {
  constructor(
    public idDesafio: string,  // ID do desafio associado
    public data: string,       // ex: '2025-06-07'
    public cumpriuMeta: boolean,
    public observacao?: string
  ) {}
}
