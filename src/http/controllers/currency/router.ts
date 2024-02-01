import { FastifyInstance } from "fastify";
import GetAllCurrencyController from "./GetAllCurrencyController";

const currencyRouter = async (app: FastifyInstance) => {
  app.get('/', GetAllCurrencyController)
}

export default currencyRouter