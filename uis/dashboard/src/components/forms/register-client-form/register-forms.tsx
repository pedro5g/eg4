import { useStepsControl } from "@/components/forms/register-client-form/hooks/use-steps-control";
import { RegisterFormFistStep } from "./step-one";
import { RegisterFormSecondStep } from "./step-two";
import { Overview } from "./overview";

const steps = [
  { id: 1, name: "Dados Pessoas" },
  { id: 2, name: "Endereço" },
  { id: 3, name: "Overview" },
];

export const RegisterClientForms = () => {
  const { currentStep, navigate } = useStepsControl();

  const getFormStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <RegisterFormFistStep />;
      case 2:
        return <RegisterFormSecondStep />;
      case 3:
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
                <div key={s.id} className="relative flex items-center ">
                  <button
                    aria-label={s.name}
                    type="submit"
                    onClick={() => {
                      navigate(s.id);
                    }}
                    className={`z-5 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors cursor-pointer ${
                      currentStep > s.id
                        ? " border-blue-500 text-blue-500"
                        : currentStep === s.id
                        ? "border-blue-500 text-blue-500 ring-3 ring-blue-500/50"
                        : "border-muted-foreground/30 text-muted-foreground/30"
                    }`}>
                    {s.id}
                  </button>
                  <p className="mx-1 text-zinc-600 text-sm z-10">{s.name}</p>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-30 h-1 mx-1 z-5 ${
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
