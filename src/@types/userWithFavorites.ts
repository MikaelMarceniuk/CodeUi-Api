import { Prisma } from "@prisma/client";

type UserWithFavorites = Prisma.UserGetPayload<{
  include: {
    favorites: true
  }
}>

export default UserWithFavorites