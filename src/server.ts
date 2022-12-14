import { checkJwt } from './check-jwt';
import { AppDataSource } from './data-source';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';

//Carrego variaveis de ambiente
dotenv.config();

//Instancio uma aplicação express
const app = express();

//Determina a porta de execução
const PORT = process.env.PORT || 3301;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


//Importa as rotas
app.use('/matercoin-server', routes);

//Tento conectar ao banco e, se não conseguir, mostro o erro.
AppDataSource.initialize() 
    .then(() => {

        //Inicio a aplicação
        app.listen(PORT, () => {
            console.log(`Service matercoin-server running in port ${PORT}`);
        })

    })
    .catch(error => {
        console.log('Ops! Ocorreu um erro.');
        console.error(error);
    });


