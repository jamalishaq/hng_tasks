class AppError extends Error {
  constructor(details,error, statusCode) {
    super(message);

    this.name = this.constructor.name; // Good practice for custom errors
    this.details = details;
    this.error = error;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class InternalServerError extends AppError {
  constructor({
    details,
    error = "Internal server error",
  } = {}) {
    super(details, error, 500);
  }
}

export class BadRequestError extends AppError {
  constructor({
    details, error
  } = {}) {
    super(details, error, 400);
  }
}

export class NotFoundError extends AppError {
  constructor({
    details, error
  } = {}) {
    super(details, error, 404);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor({
    details, error
  } = {}) {
    super(details, error, 409);
  }
}