import bcrypt from "bcrypt"

const hashUserPassword = async (password: string) => {
  const saltRounds = 6

  return await bcrypt.hash(password, saltRounds)
}

export default hashUserPassword
