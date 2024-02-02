import { Prisma } from "@prisma/client";

type AllProjectInfo = Prisma.ProjectGetPayload<{
  include: {
    services: true
  }
}>

export default AllProjectInfo