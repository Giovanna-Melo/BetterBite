module.exports = `
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senhaHash TEXT NOT NULL,
  dataNascimento TEXT NOT NULL,
  genero TEXT,
  peso REAL,
  altura REAL,
  restricoesAlimentares TEXT
);

CREATE TABLE IF NOT EXISTS desafios (
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT,
  tipoMeta TEXT NOT NULL,
  unidade TEXT,
  valorMeta REAL NOT NULL,
  frequencia TEXT NOT NULL,
  duracao INTEGER NOT NULL,
  ehPersonalizavel INTEGER NOT NULL,
  ativo INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS desafiosUsuarios (
  id TEXT PRIMARY KEY NOT NULL,
  usuarioId TEXT NOT NULL,
  desafioId TEXT NOT NULL,
  dataInicio TEXT NOT NULL,
  dataFim TEXT NOT NULL,
  status TEXT NOT NULL,
  progresso INTEGER NOT NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (desafioId) REFERENCES desafios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registrosDesafio (
  id TEXT PRIMARY KEY NOT NULL,
  desafioUsuarioId TEXT NOT NULL,
  data TEXT NOT NULL,
  consumo REAL NOT NULL,
  observacao TEXT,
  FOREIGN KEY (desafioUsuarioId) REFERENCES desafiosUsuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notificacoes (
  id TEXT PRIMARY KEY NOT NULL,
  usuarioId TEXT NOT NULL,
  texto TEXT NOT NULL,
  horarioAgendado TEXT NOT NULL,
  tipo TEXT NOT NULL,
  lida INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receitas (
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  imagemUrl TEXT,
  ingredientes TEXT NOT NULL,
  preparo TEXT,
  tempoPreparoMin INTEGER,
  porcoes INTEGER,
  caloriasPorPorcao REAL,
  proteinasPorPorcao REAL,
  gordurasPorPorcao REAL,
  fibrasPorPorcao REAL
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS receita_tags (
  receitaId TEXT NOT NULL,
  tagId TEXT NOT NULL,
  PRIMARY KEY (receitaId, tagId),
  FOREIGN KEY (receitaId) REFERENCES receitas(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
);
`;