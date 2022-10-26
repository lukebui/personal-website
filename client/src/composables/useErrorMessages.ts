import { ValidationError } from "yup";

export function useErrorMessages() {
  function getErrorMessages(error: unknown): string[] {
    if (typeof error === "string") {
      return [error];
    } else if (error instanceof ValidationError) {
      const errorMessages = [];
      if (error.inner.length) {
        for (const innerError of error.inner) {
          errorMessages.push(innerError.message);
        }
        return errorMessages;
      } else {
        return [error.message];
      }
    } else if (error instanceof Error) {
      return [error.message];
    } else {
      return [`${error}`];
    }
  }

  return { getErrorMessages };
}
