export const constructErrorTypes = {
  INVALID_TYPE: "invalid_type",
  INVALID_FORMAT: "invalid_format",
  MISSING: "missing",
};

export const constructMissingFieldErrorMsg = ({
  fieldName,
  location,
}: {
  fieldName: string;
  location: string;
}) => `${fieldName} is required in the ${location}`;
export const constructInvalidTypeErrorMsg = ({
  fieldName,
  type,
}: {
  fieldName: string;
  type: string;
}) => `${fieldName} type required to be ${type}`;
export const constructInvalidFormatErrorMsg = ({
  fieldName,
  format,
}: {
  fieldName: string;
  format: string;
}) => `${fieldName} is not a valid ${format}`;
