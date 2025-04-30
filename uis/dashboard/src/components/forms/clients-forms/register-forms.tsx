import { useRegisterClientStep } from "@/hooks/use-register-client-step";
import { RegisterFormFistStep } from "./step-one";
import { RegisterFormSecondStep } from "./step-two";
import { RegisterFormThirdStep } from "./step-three";
import { Overview } from "./overview";
import { CheckIcon } from "lucide-react";

const steps = [
  { id: 1, name: "Initial data" },
  { id: 2, name: "Address" },
  { id: 3, name: "Documents" },
  { id: 4, name: "Overview" },
];

export const RegisterClientForms = () => {
  const { currentStep } = useRegisterClientStep();

  const getFormStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <RegisterFormFistStep />;
      case 2:
        return <RegisterFormSecondStep />;
      case 3:
        return <RegisterFormThirdStep />;
      case 4:
        return <Overview />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full py-4">
        <h3 className="text-4xl font-bold text-zinc-800 ">Cadastrar Cliente</h3>
      </div>
      <div>
        <div>
          <div className="flex justify-center">
            <div className="flex items-center">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <button
                    aria-label={s.name}
                    type="submit"
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors cursor-pointer ${
                      currentStep > s.id
                        ? " border-blue-500 text-blue-500"
                        : currentStep === s.id
                        ? "border-blue-500 text-blue-500 ring-3 ring-blue-500/50"
                        : "border-muted-foreground/30 text-muted-foreground/30"
                    }`}>
                    {currentStep > s.id ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      s.id
                    )}
                  </button>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-12 h-1 ${
                        currentStep >= s.id + 1
                          ? "bg-blue-500"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">{getFormStep(currentStep)}</div>
    </div>
  );
};
