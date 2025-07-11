// services/database.ts
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import initSqlJs from 'sql.js';

let db: any = null;
let SQL: any = null;  // Referência ao módulo SQL.js

// Função que inicializa o banco (precisa ser chamada antes de usar o banco na web)
export async function initDatabase() {
  if (Platform.OS === 'web') {
    if (!SQL) {
      SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`, // caminho do wasm
      });
    }
    if (!db) {
      db = new SQL.Database(); // cria banco em memória
    }
  } else {
    if (!db) {
      db = SQLite.openDatabase('betterbite.db');
    }
  }
}

// Função para executar queries
export async function executarQuery(sql: string, params: any[] = []) {
  if (!db) {
    await initDatabase();
  }

  if (Platform.OS === 'web') {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);

      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();

      return { rows: { _array: results } };
    } catch (error) {
      throw error;
    }
  } else {
    return new Promise((resolve, reject) => {
      db.transaction((tx: any) => {
        tx.executeSql(
          sql,
          params,
          (_: any, result: any) => resolve(result),
          (_: any, error: any) => reject(error)
        );
      });
    });
  }
}

export default {
  initDatabase,
  executarQuery,
};