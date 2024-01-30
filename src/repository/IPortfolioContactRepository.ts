import { PortfolioContact, Prisma } from "@prisma/client"

interface IIPortfolioContactRepository {
  save(data: Prisma.PortfolioContactCreateInput): Promise<PortfolioContact>
}

export default IIPortfolioContactRepository
