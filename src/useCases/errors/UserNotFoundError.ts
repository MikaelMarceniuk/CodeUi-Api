class UserNotFoundError extends Error {
  constructor() {
    super('Not found.')
  }
}

export default UserNotFoundError
