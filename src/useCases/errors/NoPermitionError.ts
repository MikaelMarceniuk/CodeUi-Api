class NoPermitionError extends Error {
  constructor() {
    super('No permission.')
  }
}

export default NoPermitionError
