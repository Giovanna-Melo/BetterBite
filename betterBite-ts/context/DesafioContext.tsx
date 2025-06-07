import React, { createContext, useContext, useState } from 'react';
import { Desafio } from '../model/Desafio';

type DesafioContextType = {
  desafios: Desafio[];
  adicionarDesafio: (desafio: Desafio) => void;
};

const DesafioContext = createContext<DesafioContextType>({
  desafios: [],
  adicionarDesafio: () => {},
});

export const useDesafios = () => useContext(DesafioContext);

export const DesafioProvider = ({ children }: { children: React.ReactNode }) => {
  const [desafios, setDesafios] = useState<Desafio[]>([]);

  const adicionarDesafio = (desafio: Desafio) => {
    setDesafios((prev) => [...prev, desafio]);
  };

  return (
    <DesafioContext.Provider value={{ desafios, adicionarDesafio }}>
      {children}
    </DesafioContext.Provider>
  );
};
