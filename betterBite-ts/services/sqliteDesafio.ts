// services/sqliteDesafio.ts
import database from './database';

export async function createDesafioTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS desafios (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT,
      descricao TEXT,
      categoria TEXT,
      tipoMeta TEXT,
      unidade TEXT,
      valorMeta REAL,
      frequencia TEXT,
      duracao INTEGER,
      ehPersonalizavel INTEGER,
      ativo INTEGER
    );
  `;
  await database.executarQuery(sql);
}

export async function inserirDesafio(desafio: any) {
  const sql = `
    INSERT OR REPLACE INTO desafios (
      id, nome, descricao, categoria, tipoMeta, unidade, valorMeta, frequencia, duracao, ehPersonalizavel, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    desafio.id,
    desafio.nome,
    desafio.descricao,
    desafio.categoria,
    desafio.tipoMeta,
    desafio.unidade,
    desafio.valorMeta,
    desafio.frequencia,
    desafio.duracao,
    desafio.ehPersonalizavel ? 1 : 0,
    desafio.ativo ? 1 : 0,
  ];

  await database.executarQuery(sql, params);
}

export async function buscarDesafios() {
  const sql = `SELECT * FROM desafios;`;
  const result = await database.executarQuery(sql);

  // mobile: resultado no formato { rows: { _array: [...] } }
  if (result?.rows?._array) {
    return result.rows._array.map((row: any) => ({
      ...row,
      ehPersonalizavel: row.ehPersonalizavel === 1,
      ativo: row.ativo === 1,
    }));
  }

  // web (sql.js): resultado é array de statements com columns e values
  if (Array.isArray(result) && result.length > 0 && result[0].columns && result[0].values) {
    const columns = result[0].columns;
    const values = result[0].values;
    return values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      obj.ehPersonalizavel = obj.ehPersonalizavel === 1;
      obj.ativo = obj.ativo === 1;
      return obj;
    });
  }

  return [];
}
