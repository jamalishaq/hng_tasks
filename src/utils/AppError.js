class AppError extends Error {
  constructor(code, details, message, suggestion, statusCode) {
    super(message);

    this.name = this.constructor.name; // Good practice for custom errors
    this.code = code;
    this.details = details;
    this.suggestion = suggestion;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

class InternalServerError extends AppError {
  constructor({
    code = "INTERNAL_SERVER_ERROR",
    details = "Something went wrong",
    message = "Server down at the moment, try again later.",
    suggestion = "Check your internet connection",
  } = {}) {
    super(code, details, message, suggestion, 500);
  }
}

class BadRequestError extends AppError {
  constructor({
    code = "BAD_REQUEST", details, message, suggestion
  } = {}) {
    super(code, details, message, suggestion, 400);
  }
}

class NotFoundError extends AppError {
  constructor({
    code = "RESOURCE_NOT_FOUND", details, message, suggestion
  } = {}) {
    super(code, details, message, suggestion, 404);
  }
}

class ConflictError extends AppError {
  constructor({
    code = "STRING_ALREADY_ANALYZED", details, message, suggestion
  } = {}) {
    super(code, details, message, suggestion, 409);
  }
}

class UnprocessableError extends AppError {
  constructor({
    code = "INVALID_DATA_TYPE", details, message, suggestion
  } = {}) {
    super(code, details, message, suggestion, 422);
  }
}

export default {
    InternalServerError,
    BadRequestError,
    NotFoundError,
    ConflictError,
    UnprocessableError
}
