import { DesafioUsuario } from '../model/DesafioUsuario';
import { usuarioIds } from './usuarioMock';
import { desafioIds } from './desafioMock';

export const desafiosUsuariosMock: DesafioUsuario[] = [
  new DesafioUsuario(usuarioIds[0], desafioIds[0], new Date(), new Date(Date.now() + 7 * 86400000), 'ativo', 0),
  new DesafioUsuario(usuarioIds[1], desafioIds[1], new Date(), new Date(Date.now() + 7 * 86400000), 'ativo', 0),
  new DesafioUsuario(usuarioIds[2], desafioIds[2], new Date(), new Date(Date.now() + 5 * 86400000), 'completo', 100),
  new DesafioUsuario(usuarioIds[3], desafioIds[3], new Date(), new Date(Date.now() + 5 * 86400000), 'falhou', 40),
  new DesafioUsuario(usuarioIds[4], desafioIds[4], new Date(), new Date(Date.now() + 7 * 86400000), 'ativo', 25),
  new DesafioUsuario(usuarioIds[5], desafioIds[5], new Date(), new Date(Date.now() + 5 * 86400000), 'ativo', 10),
  new DesafioUsuario(usuarioIds[6], desafioIds[6], new Date(), new Date(Date.now() + 7 * 86400000), 'ativo', 5)
];