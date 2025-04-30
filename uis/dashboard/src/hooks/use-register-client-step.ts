import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";

export const useRegisterClientStep = () => {
  const [currentStep, setCurrentStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1)
  );
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const next = () => {
    setCurrentStep((step) => step + 1);
  };
  const prev = () => {
    setCurrentStep((step) => {
      if (step <= 0) return 1;
      return step - 1;
    });
  };

  const setStep = (step: number) => {
    setCurrentStep(step);
  };

  return { currentStep, next, prev, direction, setDirection, setStep };
};
