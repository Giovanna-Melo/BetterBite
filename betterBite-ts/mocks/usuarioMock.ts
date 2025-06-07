import { Usuario } from '../model/Usuario';
import { v4 as uuidv4 } from 'uuid';

export const usuarioIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

export const usuariosMock: Usuario[] = [
  new Usuario('Beatriz Costa', 'bea@example.com', 'hash1', new Date('2000-01-01'), 'feminino', 60, 165, ['lactose']),
  new Usuario('Giovanna Melo', 'gio@example.com', 'hash2', new Date('1999-02-02'), 'feminino', 58, 160, ['gluten']),
  new Usuario('Maria Eloisa', 'eloisa@example.com', 'hash3', new Date('1998-03-03'), 'feminino', 62, 162, []),
  new Usuario('Tony Ramos', 'tony@example.com', 'hash4', new Date('1995-04-04'), 'masculino', 75, 178, ['frutos do mar']),
  new Usuario('Arlete Salles', 'arlete@example.com', 'hash5', new Date('2001-05-05'), 'feminino', 55, 158, ['soja']),
  new Usuario('Alexandre Nero', 'alexandre@example.com', 'hash6', new Date('1997-06-06'), 'masculino', 70, 170, []),
  new Usuario('Susana Vieira', 'susana@example.com', 'hash7', new Date('1996-07-07'), 'feminino', 65, 168, ['amendoim'])
];