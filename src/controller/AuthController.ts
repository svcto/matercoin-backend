import { Request, Response } from "express";
import { getRepository, TypeORMError } from "typeorm";
import { Usuario } from "../entity/Usuario";

import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'


class AuthControler {

     async autenticacao(request: Request, response: Response) {
        const repository = getRepository(Usuario);
        const {email, senha } = request.body;

        const usuario = await repository.findOne({where: {email}});

        if (!usuario) {
            return response.sendStatus(401);
        }

        const isValidPassword = await bcrypt.compare(senha, usuario.senha);

        if (!isValidPassword) {
            return response.sendStatus(401);
        }

        const token = jwt.sign({ id: usuario.id}, 'secret', {expiresIn: '1d'})

        return response.json({
            usuario,
            token,
        })

}
}
export default new AuthControler();