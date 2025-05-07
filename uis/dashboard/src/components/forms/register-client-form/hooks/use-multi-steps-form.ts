import { useContext } from "react";
import { FormProvider } from "../provider/form-context";

export const useMultiStepsForm = () => {
  const context = useContext(FormProvider);

  if (!context) {
    throw new Error(
      "useMultiStepsForm must be used within RegisterClientFormContext"
    );
  }
  return context;
};
