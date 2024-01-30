import Postgresql from "@libs/postgresql";
import { Prisma } from "@prisma/client";
import IPortfolioContactRepository from "@repository/IPortfolioContactRepository";

class PrismaPortfolioContactRepo implements IPortfolioContactRepository {
	save(data: Prisma.PortfolioContactCreateInput) {
		return Postgresql.getInstance().portfolioContact.create({ data })	
	}
}

export default PrismaPortfolioContactRepo