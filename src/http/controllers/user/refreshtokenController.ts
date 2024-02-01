import { FastifyReply, FastifyRequest } from "fastify"

const refreshTokenController = async (req: FastifyRequest, rep: FastifyReply) => {
  await req.jwtVerify({ onlyCookie: true })

  const { id } = req.user

  const token = await rep.jwtSign({ id }, { sign: { sub: id } })

  const refreshToken = await rep.jwtSign(
    { id },
    { sign: { sub: id, expiresIn: "7d" } }
  )

  return rep
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}

export default refreshTokenController