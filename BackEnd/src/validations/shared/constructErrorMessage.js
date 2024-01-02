export const constructErrorTypes = {
  INVALID_TYPE: "invalid_type",
  INVALID_FORMAT: "invalid_format",
  MISSING: "missing",
};

export const constructMissingFieldErrorMsg = ({ fieldName, location }) =>
  `${fieldName} is required in the ${location}`;
export const constructInvalidTypeErrorMsg = ({ fieldName, type }) =>
  `${fieldName} type required to be ${type}`;
export const constructInvalidFormatErrorMsg = ({ fieldName, format }) =>
  `${fieldName} is not a valid ${format}`;
