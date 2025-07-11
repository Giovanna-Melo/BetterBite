// context/DataContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { initDatabase, buscarDesafios, adicionarDesafio } from '../Database'; // Sobe um nível para achar o Database.js
import { Desafio } from '../model/Desafio'; // Importe sua classe Desafio

// 1. Criar o Contexto
const DataContext = createContext();

// 2. Criar o Provedor
export const DataProvider = ({ children }) => {
  const [desafios, setDesafios] = useState([]);
  const [carregandoDB, setCarregandoDB] = useState(true);

  // Efeito para inicializar e carregar os dados do DB na primeira vez
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        await initDatabase(); // Garante que a tabela exista
        const desafiosDoDb = await buscarDesafios(); // Busca os desafios salvos
        setDesafios(desafiosDoDb); // Coloca no estado
      } catch (e) {
        console.error("Erro ao carregar dados do banco de dados", e);
      } finally {
        setCarregandoDB(false); // Termina o carregamento
      }
    }
    carregarDadosIniciais();
  }, []);

  // --- Funções que as telas irão chamar ---
  const handleAdicionarDesafio = async (dadosDoFormulario) => {
    // Cria uma nova instância do Desafio com os dados da tela
    const novoDesafio = new Desafio(
        dadosDoFormulario.nome,
        dadosDoFormulario.descricao,
        // ...todas as outras propriedades do formulário
        dadosDoFormulario.categoria,
        dadosDoFormulario.tipoMeta,
        dadosDoFormulario.unidade,
        dadosDoFormulario.valorMeta,
        dadosDoFormulario.frequencia,
        dadosDoFormulario.duracao,
        dadosDoFormulario.ehPersonalizavel,
        true // ativo
    );

    try {
      await adicionarDesafio(novoDesafio); // Salva no SQLite
      const desafiosAtualizados = await buscarDesafios(); // Recarrega do SQLite
      setDesafios(desafiosAtualizados); // Atualiza o estado para a UI refletir a mudança
    } catch (e) {
      console.error("Falha ao adicionar desafio", e);
      throw e; // Lança o erro para a tela poder mostrar um alerta, por exemplo
    }
  };

  const value = {
    desafios,
    carregandoDB,
    handleAdicionarDesafio,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// 3. Criar um Hook para facilitar o uso nas telas
export const useData = () => {
  return useContext(DataContext);
};