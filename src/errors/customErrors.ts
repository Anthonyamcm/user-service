/**
 * Custom error indicating that a user with the specified username already exists.
 */
export class UserAlreadyExistsError extends Error {
  constructor(message: string = 'Username already exists') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

/**
 * Custom error indicating that a user was not found.
 */
export class UserNotFoundError extends Error {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}
