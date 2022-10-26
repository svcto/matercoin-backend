import { Router } from 'express';
import { checkJwt } from './check-jwt';
import MoedaController from './controller/MoedaController';
import MovimentacaoController from './controller/MovimentacaoController';
import PeriodoController from './controller/PeriodoController';
import UsuarioController from './controller/UsuarioController';

//Instancio o router do express
const routes = Router();

routes.use(checkJwt);

//Rotas da Usuário
routes.route('/usuarios')
    .get(UsuarioController.index, )
    .post(UsuarioController.create, );

routes.route('/usuarios/:id')
    .get(UsuarioController.show, )
    .put(UsuarioController.update, )
    .delete(UsuarioController.remove, );

//Rotas da Moeda
routes.route('/moedas')
    .get(MoedaController.index, )
    .post(MoedaController.create, );

routes.route('/moedas/:id')
    .get(MoedaController.show, )
    .put(MoedaController.update, )
    .delete(MoedaController.remove, );


//Rotas da Periodos
routes.route('/periodos')
    .get(PeriodoController.index, )
    .post(PeriodoController.create, );

routes.route('/periodos/:id')
    .get(PeriodoController.show, )
    .put(PeriodoController.update, )
    .delete(PeriodoController.remove, );

//Rotas da Movimentos
routes.route('/movimentos')
    .get(MovimentacaoController.index, )
    .post(MovimentacaoController.create, );

routes.route('/movimentos/:id')
    .get(MovimentacaoController.show, )
    .put(MovimentacaoController.update, )
    .delete(MovimentacaoController.remove, );


export default routes;