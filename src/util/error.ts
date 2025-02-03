export class AlreadyExistError extends Error {
  statusCode: number = 409;
  errorCode: string = "ALREADY_EXIST";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NotFoundError extends Error {
  statusCode: number = 404;
  errorCode: string = "DATA_NOT_FOUND";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidInputError extends Error {
  statusCode: number = 400;
  errorCode: string = "INVALID_INPUT";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class APIError extends Error {
  statusCode: number = 500;
  errorCode: string = "API_PROCESS_ERROR";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DBError extends Error {
  statusCode: number = 500;
  errorCode: string = "DB_PROCESS_ERROR";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
