import bcrypt from 'bcrypt'

const doesPasswordHashMatchPassword = async (
  password: string,
  passwordHash: string
) => {
  return await bcrypt.compare(password, passwordHash)
}

export default doesPasswordHashMatchPassword
