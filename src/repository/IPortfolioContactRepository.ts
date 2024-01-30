import { PortfolioContact, Prisma } from "@prisma/client"

interface IPortfolioContactRepository {
  save(data: Prisma.PortfolioContactCreateInput): Promise<PortfolioContact>
}

export default IPortfolioContactRepository
