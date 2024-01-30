import Postgresql from "@libs/postgresql";
import { Prisma } from "@prisma/client";
import IUserRepository from "@repository/IUserRepository";

class PrismaUserRepo implements IUserRepository {
	async findById(id: string) {
		return await Postgresql.getInstance().user.findUnique({ where: { id } })	
	}

	async findByEmail(email: string) {
		return await Postgresql.getInstance().user.findUnique({ where: { email } })
	}

	async getAllInfoById(id: string): Promise<Prisma.UserGetPayload<{ include: { favorites: true } }> | null> {
		return await Postgresql.getInstance().user.findUnique({
			where: { id },
			include: {
				favorites: true
			}
		})
	}

	async save(data: Prisma.UserCreateInput) {
		return await Postgresql.getInstance().user.create({ data })
	}

	async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
		return await Postgresql.getInstance().user.update({ data, where: { id } })	
	}
}

export default PrismaUserRepo