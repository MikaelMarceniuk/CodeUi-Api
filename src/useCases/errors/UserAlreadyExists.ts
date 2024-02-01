class UserAlreadyExistsError extends Error {
  constructor() {
    super('User already exists.')
  }
}

export default UserAlreadyExistsError
