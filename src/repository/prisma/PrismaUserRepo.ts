import Postgresql from "@libs/postgresql";
import { Prisma } from "@prisma/client";
import IUserRepository from "@repository/IUserRepository";

class PrismaUserRepo implements IUserRepository {
	findByEmail(email: string) {
		return Postgresql.getInstance().user.findUnique({ where: { email } })
	}

	save(data: Prisma.UserCreateInput) {
		return Postgresql.getInstance().user.create({ data })
	}
}

export default PrismaUserRepo