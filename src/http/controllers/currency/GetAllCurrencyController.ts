import { Currency } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

const GetAllCurrencyController = (req: FastifyRequest, rep: FastifyReply) => {
  const currencies = Object.values(Currency).map(c => c)

  rep.statusCode = 200
  rep.send({ currencies })
}

export default GetAllCurrencyController