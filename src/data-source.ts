import { Movimentacao } from './entity/Movimentacao';
import { Moeda } from './entity/Moeda';

import 'reflect-metadata';
import {DataSource} from 'typeorm';
import { Usuario } from './entity/Usuario';
import { Periodo } from './entity/Periodo';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Koihw2017',
    database: 'prmdb',
    synchronize: true,
    logging: true,
    entities: [Usuario, Periodo, Moeda, Movimentacao]
});