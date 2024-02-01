class UserFavoriteLimitError extends Error {
  constructor() {
    super('User can only have 3 favorites.')
  }
}

export default UserFavoriteLimitError
