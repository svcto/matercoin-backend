import { Request, Response } from "express";
import { Like, TypeORMError } from "typeorm";
import { ISearchParam } from "../dto/interfaces";
import { Moeda } from "../entity/Moeda";

class MoedaController {
  public async index(request: Request, response: Response) {
    try {
      const searchParam: ISearchParam[] = JSON.parse(
        (request.query.params as string) || "[]"
      );

      const skip = Number(request.query.skip) || 0;
      const take = Number(request.query.take) || 10;

      let where: any[] = [];
      for (const sp of searchParam) {
        let w;
        if (sp.compareType == "LIKE") {
          w = { [sp.paramName]: Like(`%${sp.paramValue}%`) };
        } else {
          w = { [sp.paramName]: sp.paramValue };
        }
        where.push(w);
      }

      const objs = await Moeda.find({
        where: where.length ? where : undefined,
        skip: skip,
        take: take,
      });

      //Buscar TODOS os registros do banco
      //const categories = await Moeda.find();

      //Retorno a lista
      return response.json(objs);
    } catch (e) {
      const error = e as TypeORMError;
      return response.status(500).json({ message: error.message });
    }
  }

  public async create(request: Request, response: Response) {
    try {
      if (request.body.id && request.body.id <= 0) {
        request.body.id = null;
      }

      //Salvo no banco a entidade que veio na requisição
      const category = await Moeda.save(request.body);

      //Retorno a entidade inserida
      return response.status(201).json(category);
    } catch (e) {
      const error = e as TypeORMError;
      return response.status(500).json({ message: error.message });
    }
  }

  public async show(request: Request, response: Response) {
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
      const found = await Moeda.findOneBy({
        id: Number(id),
      });

      //Verifico se encontrou a category
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
      const found = await Moeda.findOneBy({
        id: Number(id),
      });

      //Verifico se encontrou a category
      if (!found) {
        return response.status(404).json({ message: "Recurso não encontrado" });
      }

      //Atualizo com os nos dados
      await Moeda.update(found.id, request.body);

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
      const found = await Moeda.findOneBy({
        id: Number(id),
      });

      //Verifico se encontrou a category
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

export default new MoedaController();
