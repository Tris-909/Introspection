export const returnResponse = (data: Record<string, any>, message: string) => {
  return {
    data: data,
    message: message,
  };
};
