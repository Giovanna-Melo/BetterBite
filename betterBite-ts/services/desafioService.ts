import { Platform } from 'react-native';

import * as desafioSqlJs from './sqljsDesafio';  // para web (sql.js)
import * as desafioSQLite from './sqliteDesafio'; // para mobile (expo-sqlite)

const isWeb = Platform.OS === 'web';

export async function criarTabelaDesafios() {
  if (isWeb) {
    return desafioSqlJs.createDesafioTable();
  } else {
    return desafioSQLite.createDesafioTable();
  }
}

export async function inserirDesafio(desafio: any) {
  if (isWeb) {
    return desafioSqlJs.inserirDesafio(desafio);
  } else {
    return desafioSQLite.inserirDesafio(desafio);
  }
}

export async function buscarDesafios() {
  if (isWeb) {
    return desafioSqlJs.buscarDesafios();
  } else {
    return desafioSQLite.buscarDesafios();
  }
}
