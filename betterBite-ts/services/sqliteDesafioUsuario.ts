// services/sqliteDesafioUsuario.ts
import database from './database';
import { DesafioUsuario } from '../model/DesafioUsuario';

export async function createDesafioUsuarioTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS desafioUsuario (
      id TEXT PRIMARY KEY NOT NULL,
      usuarioId TEXT NOT NULL,
      desafioId TEXT NOT NULL,
      dataInicio TEXT NOT NULL,
      dataFim TEXT NOT NULL,
      status TEXT NOT NULL,
      progresso REAL NOT NULL
    );
  `;
  await database.executarQuery(sql);
}

export async function inserirDesafioUsuario(desafioUsuario: DesafioUsuario) {
  const sql = `
    INSERT OR REPLACE INTO desafioUsuario (
      id, usuarioId, desafioId, dataInicio, dataFim, status, progresso
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    desafioUsuario.id,
    desafioUsuario.usuarioId,
    desafioUsuario.desafioId,
    desafioUsuario.dataInicio.toISOString(),
    desafioUsuario.dataFim.toISOString(),
    desafioUsuario.status,
    desafioUsuario.progresso
  ];

  await database.executarQuery(sql, params);
}

export async function buscarDesafiosDoUsuario(usuarioId: string): Promise<DesafioUsuario[]> {
  const sql = `
    SELECT * FROM desafioUsuario WHERE usuarioId = ?;
  `;
  const result = await database.executarQuery(sql, [usuarioId]);

  const parseRow = (row: any) =>
    new DesafioUsuario(
      row.usuarioId,
      row.desafioId,
      new Date(row.dataInicio),
      new Date(row.dataFim),
      row.status,
      row.progresso
    );

  if (result?.rows?._array) {
    return result.rows._array.map(parseRow); // mobile
  } else if (Array.isArray(result) && result.length > 0) {
    const { columns, values } = result[0];
    return values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return parseRow(obj);
    });
  }

  return [];
}
