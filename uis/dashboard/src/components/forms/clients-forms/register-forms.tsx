import { useRegisterClientStep } from "@/hooks/use-register-client-step";
import { RegisterFormFistStep } from "./step-one";
import { RegisterFormSecondStep } from "./step-two";
import { RegisterFormThirdStep } from "./step-three";
import { Button } from "@/components/ui/button";

export const RegisterClientForms = () => {
  const { currentStep, prev, next } = useRegisterClientStep();

  const getFormStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <RegisterFormFistStep />;
      case 2:
        return <RegisterFormSecondStep />;
      case 3:
        return <RegisterFormThirdStep />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full py-4">
        <h3 className="text-4xl font-bold text-zinc-800 ">Registrar</h3>
      </div>
      <div className="flex-1">{getFormStep(currentStep)}</div>
      <footer className="w-full">
        <div className="flex items-center justify-between  ">
          {currentStep > 1 && (
            <Button
              type="submit"
              className=" bg-blue-500 hover:bg-blue-600 cursor-pointer"
              onClick={() => prev()}>
              Voltar
            </Button>
          )}
          <Button
            form={`form_step_${currentStep}`}
            type="submit"
            className="ml-auto bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => next()}>
            Proximo
          </Button>
        </div>
      </footer>
    </div>
  );
};
