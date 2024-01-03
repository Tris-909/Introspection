export interface CustomError {
  code: string;
  message: string;
}

export type ExpressErrors = {
  errors: CustomError[];
  statusCode: number;
};

export enum ValidationCodes {
  INVALID_UUID = "invalid_uuid",
  UNKNOWN_FIELDS = "unknown_fields",
  INVALID_REQUEST_BODY = "invalid_request_body",
  INTERNAL_SERVER_ERROR = "internal_server_error",
  NOT_FOUND = "not_found",
}

export enum CollectionDatabaseNames {
  ERROR_COLLECTION = "errors",
}

export interface ErrorEntity {
  id: string;
  description: string;
  title: string;
  tags: string[];
  createdAt: Date;
}
