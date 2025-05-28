import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export const useStepsControl = () => {
  const [currentStep, setCurrentStep] = useQueryStates({
    step: parseAsInteger.withDefault(1),
    focus: parseAsString.withDefault(""),
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

  const removeFocus = () => {
    setCurrentStep(({ step }) => {
      return {
        step,
        focus: "",
      };
    });
  };

  return {
    navigate,
    currentStep: currentStep.step,
    focus: currentStep.focus,
    goToField,
    removeFocus,
  };
};
