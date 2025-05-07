import { FieldErrors } from "react-hook-form";
import { humanizeFieldName } from "./get-errors";

export type ErrorMessage = {
  field: string;
  label: string;
  message?: string;
  category?: string;
  index?: number;
};

type ErrorValue = {
  message?: string;
  type?: string;
  ref?: unknown;
} & Record<string, unknown>;

export const formatError = <T extends Record<string, unknown>>(
  errors: FieldErrors<T>
): ErrorMessage[] => {
  const formattedErrors: ErrorMessage[] = [];

  const processErrors = (
    obj: FieldErrors<T> | ErrorValue | ErrorValue[],
    parentField = "",
    parentLabel = ""
  ) => {
    if (!obj || typeof obj !== "object") {
      return;
    }

    Object.entries(obj).forEach(([key, value]) => {
      if (!key || value === undefined) {
        return;
      }

      const currentField = parentField ? `${parentField}.${key}` : key;
      const isArrayField = currentField.includes("[");
      const arrayMatch = currentField.match(/\[(\d+)\]/);
      const arrayIndex = arrayMatch ? parseInt(arrayMatch[1]) : undefined;

      const categoryName = currentField.split("[")[0];
      const categoryLabel = humanizeFieldName(categoryName);

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item) {
            processErrors(item, `${currentField}[${index}]`, categoryLabel);
          }
        });
      } else if (value && typeof value === "object") {
        const errorValues = value as ErrorValue;
        if (errorValues.message) {
          formattedErrors.push({
            field: categoryLabel,
            label: humanizeFieldName(key),
            message: errorValues.message,
            category: isArrayField ? categoryLabel : undefined,
            index: arrayIndex,
          });
        } else {
          processErrors(errorValues, currentField, parentLabel);
        }
      }
    });
  };

  try {
    processErrors(errors);
  } catch (error) {
    console.error("Error processing form errors: ", error);
  }

  return formattedErrors.sort((a, b) => {
    if (a.category && b.category) {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return (a.index || 0) - (b.index || 0);
    }
    if (a.category) return 1;
    if (b.category) return -1;
    return 0;
  });
};
