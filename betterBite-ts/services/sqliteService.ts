import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('betterbite.db');

export function executarQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}

export default {
  executarQuery,
};
