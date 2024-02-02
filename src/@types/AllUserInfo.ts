import { Prisma } from "@prisma/client";

type AllUserInfo = Prisma.UserGetPayload<{
  include: {
    favorites: true,
    projects: true
  }
}>

export default AllUserInfo