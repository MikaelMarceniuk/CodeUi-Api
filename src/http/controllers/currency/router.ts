import { FastifyInstance } from "fastify";
import GetAllCurrencyController from "./getAllCurrencyController";

const currencyRouter = async (app: FastifyInstance) => {
  app.get('/', GetAllCurrencyController)
}

export default currencyRouter