export class EntityNotFoundError implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = 'EntityNotFoundError';
    this.message = message;
  }
}

export class AuthoriseError implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = 'AuthoriseError';
    this.message = message;
  }
}

export class TanError implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = 'TanError';
    this.message = message;
  }
}

export class UserNotFoundError implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = 'UserNotFoundError';
    this.message = message;
  }
}

export class AccessNotFoundError implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = 'AccessNotFoundError';
    this.message = message;
  }
}