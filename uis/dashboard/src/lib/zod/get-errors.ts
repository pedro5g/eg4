import { ZodError } from "zod";

export const humanizeFieldName = (field: string | number): string => {
  const str = field.toString();

  return str
    .split(/(?=(A-Z))/)
    .join(" ")
    .replace(/^./, (item) => item.toUpperCase());
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof ZodError) {
    message = error.errors
      .map(({ path, message }) => `${humanizeFieldName(path[0])}: ${message}`)
      .join(", ");
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "unknown error";
  }

  return message;
};
