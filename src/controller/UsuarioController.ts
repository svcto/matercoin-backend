import { Request, Response } from "express";
import { Body, Param, QueryParam } from "routing-controllers";
import { Like, TypeORMError } from "typeorm";
import { ISearchParam } from "../dto/interfaces";
import { Periodo } from "../entity/Periodo";
import { Usuario } from "../entity/Usuario";


class UsuarioController {

    public async index(request: Request, response: Response) {
        try {
            const searchParam: ISearchParam[] = JSON.parse(request.query.params as string || "[]")

            const skip = Number(request.query.skip) || 0;
            const take = Number(request.query.take) || 10;

            const where: any[] = [];
            for (const sp of searchParam) {
                let w;
                if (sp.compareType == "LIKE") {
                    w = { [sp.paramName]: Like(`%${sp.paramValue}%`) }
                } else {
                    w = { [sp.paramName]: sp.paramValue }
                }
                where.push(w)
            }

            const objs = await Usuario.find(
                {
                    where: where.length ? where:undefined,
                    skip: skip, take: take

                });


            //Buscar TODOS os registros do banco
            //const objs = await Usuario.find();

            //Retorno a lista
            return response.json(objs);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({ message: error.message });
        }

    }

    public async create(request: Request, response: Response) {
        try {
            //Salvo no banco a entidade que veio na requisição
            const entidade = await Usuario.save(request.body);

            //Retorno a entidade inserida
            return response.status(201).json(entidade);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({ message: error.message });
        }
    }

    public async show(request: Request, response: Response) {
        try {
            const ra = request.query.ra as string;
            const { id } = request.params;
            if (!id) {
                return response.status(400).json({ message: 'Parâmetros não informados' })
            }
            let found = undefined;
            if (id && id != "0") {
                found = await Usuario.findOneBy({
                    id: Number(id)
                });
            } else if (ra) {
                found = await Usuario.findOneBy({
                    ra: ra
                });
            }

            const nome = request.query.nome as string;
            if (!id) {
                return response.status(400).json({ message: 'Parâmetros não informados' })
            }
            if (id && id != "0") {
                found = await Usuario.findOneBy({
                    id: Number(id)
                });
            } else if (nome) {
                found = await Usuario.findOneBy({
                    ra: nome
                });
            }


            //Verifico se encontrou a entidade
            if (!found) {
                return response.status(404).json({ message: 'Recurso não encontrado' })
            }

            //Retorno a entidade encontrada
            return response.json(found);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({ message: error.message });
        }
    }

    public async moodle(request: Request, response: Response, next: any) {
        try {
            return response.status(200).json(request.body)
            //Pego o ID que foi enviado por request param
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async localizaUsuario(request: Request, response: Response) {
        try {
                ///const searchParam: ISearchParam[] = JSON.parse(request.query.params as string || "[]")
                const raMoodle = request.param("ext_user_username") as string;
    
                //Verifico se encontrou a entidade
                let foundRa = undefined;
                foundRa = await Usuario.findOneBy({
                    ra: (raMoodle)
                });
                if (!foundRa) {  

                    const descricaoPeriodo = request.param("context_title") as string;
                    let foundPeriodo = undefined;
                    foundPeriodo = await Periodo.findOneBy({
                        descricao: String (descricaoPeriodo)
                    })
                    let periodo = new Periodo()
                    if (!foundPeriodo) {
                        periodo.descricao = descricaoPeriodo
                        Periodo.save(periodo);
                    } else {
                        periodo = foundPeriodo;
                    }
                    

                    const nome = request.param("lis_person_name_full");
                    const email = request.param("lis_person_contact_email_primary");
                    const ativo = "S"
                    const saldo = 0.00;
                    
                    let usuario: Usuario = new Usuario()
                    usuario.nome = String(nome);
                    usuario.ativo = ativo;
                    usuario.email = String(email);
                    usuario.saldo = Number(saldo);
                    usuario.senha = "";
                    usuario.periodo = periodo;  
                    usuario.ra = raMoodle;
                    Usuario.save(usuario);    
                        //Retorno a entidade inserida
                        //return response.status(201).json(entidade);
                    return response.json({ message: 'usuario cadastrado' })
                }                    
        
                //Retorno a entidade encontrada
               return response.json(foundRa);
            } catch (e) {
                const error = e as TypeORMError;
                return response.status(500).json({ message: error.message });
            }
        }
    
    


    public async update(request: Request, response: Response) {
        try {
            //Pego o ID que foi enviado por request param
            const { id } = request.params;

            //Verifico se veio o parametro ID
            if (!id) {
                return response.status(400).json({ message: 'Parâmetro ID não informado' })
            }

            //Busco a entity no banco pelo ID
            const found = await Usuario.findOneBy({
                id: Number(id)
            });

            //Verifico se encontrou a entidade
            if (!found) {
                return response.status(404).json({ message: 'Recurso não encontrado' })
            }

            //Atualizo com os nos dados
            await Usuario.update(found.id, request.body);

            const novo = request.body;

            //Altero o ID para o que veio no request
            novo.id = found.id;

            //Retorno a entidade encontrada
            return response.json(novo);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({ message: error.message });
        }
    }

    public async remove(request: Request, response: Response) {
        try {
            //Pego o ID que foi enviado por request param
            const { id } = request.params;

            //Verifico se veio o parametro ID
            if (!id) {
                return response.status(400).json({ message: 'Parâmetro ID não informado' })
            }

            //Busco a entity no banco pelo ID
            const found = await Usuario.findOneBy({
                id: Number(id)
            });

            //Verifico se encontrou a entidade
            if (!found) {
                return response.status(404).json({ message: 'Recurso não encontrado' })
            }

            //Removo o registro baseado no ID
            await found.remove();

            //Retorno status 204 que é sem retorno
            return response.status(204).json();
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({ message: error.message });
        }
    }

}

export default new UsuarioController();
