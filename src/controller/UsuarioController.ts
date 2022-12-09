import { Request, Response } from "express";
import { Like, TypeORMError } from "typeorm";
import { ISearchParam } from "../dto/interfaces";
import { Periodo } from "../entity/Periodo";
import { ETipoUsuario, Usuario } from "../entity/Usuario";
import * as jwt from "jsonwebtoken";
import config from "./../config";

class UsuarioController {
  public async index(request: Request, response: Response) {
    try {
      const searchParam: ISearchParam[] = JSON.parse(
        (request.query.params as string) || "[]"
      );

      const skip = Number(request.query.skip) || 0;
      const take = Number(request.query.take) || 10;

      const where: any[] = [];
      for (const sp of searchParam) {
        let w;
        if (sp.compareType == "LIKE") {
          w = { [sp.paramName]: Like(`%${sp.paramValue}%`) };
        } else {
          w = { [sp.paramName]: sp.paramValue };
        }
        where.push(w);
      }

      const objs = await Usuario.find({
        where: where.length ? where : undefined,
        skip: skip,
        take: take,
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

  public async showByToken(request: Request, response: Response) {
    let jwtPayload;
    try {
      jwtPayload = <any>jwt.verify(request.query.token as string, config.jwtSecret);
      if (jwtPayload.role == undefined) {
        const u = await Usuario.findOneBy({id: Number(jwtPayload['userId'])});
        if (u) {
          jwtPayload.role = u.tipo;
        }
      }
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      return response
        .status(401)
        .send("Não foi possível autorizar a requisição.");
    }
    return response.json(jwtPayload);
  }

  public async show(request: Request, response: Response) {
    try {
      const ra = request.query.ra as string;
      const { id } = request.params;
      if (!id) {
        return response
          .status(400)
          .json({ message: "Parâmetros não informados" });
      }
      let found = undefined;
      if (id && id != "0") {
        found = await Usuario.findOneBy({
          id: Number(id),
        });
      } else if (ra) {
        found = await Usuario.findOneBy({
          ra: ra,
        });
      }

      const nome = request.query.nome as string;
      if (!id) {
        return response
          .status(400)
          .json({ message: "Parâmetros não informados" });
      }
      if (id && id != "0") {
        found = await Usuario.findOneBy({
          id: Number(id),
        });
      } else if (nome) {
        found = await Usuario.findOneBy({
          ra: nome,
        });
      }

      //Verifico se encontrou a entidade
      if (!found) {
        return response.status(404).json({ message: "Recurso não encontrado" });
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
      return response.status(200).json(request.body);
      //Pego o ID que foi enviado por request param
    } catch (e) {
      const error = e as TypeORMError;
      return response.status(500).json({ message: error.message });
    }
  }

  public async localizaUsuario(request: Request, response: Response) {
    try {
      const urlApp = "http://localhost:4200/#/";
      ///const searchParam: ISearchParam[] = JSON.parse(request.query.params as string || "[]")
      const raMoodle = request.param("ext_user_username") as string;
      const role = request.param("roles") as string;
      //Verifico se encontrou a entidade
      let foundRa = undefined;
      foundRa = await Usuario.findOneBy({
        ra: raMoodle,
      });
      if (!foundRa) {
        const descricaoPeriodo = request.param("context_title") as string;
        let foundPeriodo = undefined;
        foundPeriodo = await Periodo.findOneBy({
          descricao: String(descricaoPeriodo),
        });
        let periodo = new Periodo();
        if (!foundPeriodo) {
          periodo.descricao = descricaoPeriodo;
          periodo = await Periodo.save(periodo);
        } else {
          periodo = foundPeriodo;
        }

        const nome = request.param("lis_person_name_full");
        const email = request.param("lis_person_contact_email_primary");
        const ativo = "S";
        const saldo = 0.0;

        let usuario: Usuario = new Usuario();
        usuario.nome = String(nome);
        usuario.ativo = ativo;
        usuario.email = String(email);
        usuario.saldo = Number(saldo);
        usuario.senha = "";
        usuario.periodo = periodo;
        usuario.ra = raMoodle;
        if (role.trim() == 'Learner') {
          usuario.tipo = ETipoUsuario.ALUNO;
        } else {
          usuario.tipo = ETipoUsuario.PROFESSOR;
        }
        usuario = await Usuario.save(usuario);
        const newToken = jwt.sign(
          { userId: usuario.id, username: usuario.nome, role: usuario.tipo },
          config.jwtSecret
        );
        response.setHeader("token", newToken);
        //Retorno a entidade inserida
        //return response.status(201).json(entidade);
        return response.send(`
            <html>
                <head>
                    <title>MaterCoin</title>
                </head>
                <body>
                    <i>Redirecionando para o aplicativo...</i>
                    <script>
                    window.location.href = "${urlApp}?token=${newToken}";
                    </script>
                </body> 
            </html>
            `);
      }
      const newToken = jwt.sign(
        { userId: foundRa.id, username: foundRa.nome },
        config.jwtSecret
      );
      response.setHeader("token", newToken);

      //Retorno a entidade encontrada
      return response.send(`
        <html>
        <head>
            <title>MaterCoin</title>
        </head>
        <body>
            <i>Redirecionando para o aplicativo...</i>
            <script>
                window.location.href = "${urlApp}?token=${newToken}";
            </script>
        </body> 
        </html>
        `);
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
        return response
          .status(400)
          .json({ message: "Parâmetro ID não informado" });
      }

      //Busco a entity no banco pelo ID
      const found = await Usuario.findOneBy({
        id: Number(id),
      });

      //Verifico se encontrou a entidade
      if (!found) {
        return response.status(404).json({ message: "Recurso não encontrado" });
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
        return response
          .status(400)
          .json({ message: "Parâmetro ID não informado" });
      }

      //Busco a entity no banco pelo ID
      const found = await Usuario.findOneBy({
        id: Number(id),
      });

      //Verifico se encontrou a entidade
      if (!found) {
        return response.status(404).json({ message: "Recurso não encontrado" });
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
