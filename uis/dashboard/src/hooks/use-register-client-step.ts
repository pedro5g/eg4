import { parseAsInteger, useQueryState } from "nuqs";

export const useRegisterClientStep = () => {
  const [currentStep, setCurrentStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1)
  );

  const next = () => {
    setCurrentStep((step) => step + 1);
  };
  const prev = () => {
    setCurrentStep((step) => {
      if (step <= 0) return 1;
      return step - 1;
    });
  };

  return { currentStep, next, prev };
};
