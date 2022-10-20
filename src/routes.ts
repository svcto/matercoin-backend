import { Router } from 'express';
import { checkJwt } from './check-jwt';
import MoedaController from './controller/MoedaController';
import MovimentacaoController from './controller/MovimentacaoController';
import PeriodoController from './controller/PeriodoController';
import UsuarioController from './controller/UsuarioController';

//Instancio o router do express
const routes = Router();

//Rotas da Usuário
routes.route('/usuarios')
    .get(UsuarioController.index, [checkJwt])
    .post(UsuarioController.create, [checkJwt]);

routes.route('/usuarios/:id')
    .get(UsuarioController.show, [checkJwt])
    .put(UsuarioController.update, [checkJwt])
    .delete(UsuarioController.remove, [checkJwt]);

//Rotas da Moeda
routes.route('/moedas')
    .get(MoedaController.index, [checkJwt])
    .post(MoedaController.create, [checkJwt]);

routes.route('/moedas/:id')
    .get(MoedaController.show, [checkJwt])
    .put(MoedaController.update, [checkJwt])
    .delete(MoedaController.remove, [checkJwt]);


//Rotas da Periodos
routes.route('/periodos')
    .get(PeriodoController.index, [checkJwt])
    .post(PeriodoController.create, [checkJwt]);

routes.route('/periodos/:id')
    .get(PeriodoController.show, [checkJwt])
    .put(PeriodoController.update, [checkJwt])
    .delete(PeriodoController.remove, [checkJwt]);

//Rotas da Movimentos
routes.route('/movimentos')
    .get(MovimentacaoController.index, [checkJwt])
    .post(MovimentacaoController.create, [checkJwt]);

routes.route('/movimentos/:id')
    .get(MovimentacaoController.show, [checkJwt])
    .put(MovimentacaoController.update, [checkJwt])
    .delete(MovimentacaoController.remove, [checkJwt]);


export default routes;