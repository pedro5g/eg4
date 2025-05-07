import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export const useStepsControl = () => {
  const [currentStep, setCurrentStep] = useQueryStates({
    step: parseAsInteger.withDefault(1),
    focus: parseAsString,
  });

  const navigate = (step: number) => {
    setCurrentStep((prev) => {
      return { ...prev, step };
    });
  };

  const goToField = (step: number, fieldName: string) => {
    setCurrentStep({
      step,
      focus: fieldName,
    });
  };

  return {
    navigate,
    currentStep: currentStep.step,
    focus: currentStep.focus,
    goToField,
  };
};
