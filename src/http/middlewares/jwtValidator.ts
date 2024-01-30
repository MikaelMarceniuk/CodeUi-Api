import { FastifyReply, FastifyRequest } from "fastify";

const jwtValidator = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    await req.jwtVerify()
  } catch (err) {
    rep.statusCode = 401
    rep.send({ message: 'Bearer token not valid.' })
  }
}

export default jwtValidator