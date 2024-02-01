class UserFavoriteNotFoundError extends Error {
  constructor() {
    super('UserFavorite not found.')
  }
}

export default UserFavoriteNotFoundError
