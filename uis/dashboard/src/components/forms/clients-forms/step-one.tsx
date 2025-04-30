import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import {
  registerClientFirstStepSchema,
  RegisterClientFirstStepSchemaType,
} from "./schemas/register-client-form-schema";
import { useRegisterClientStep } from "@/hooks/use-register-client-step";
import { useRegisterClientForm } from "./form-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectStore } from "./select-store";
import { Button } from "@/components/ui/button";

export const RegisterFormFistStep = () => {
  const { next } = useRegisterClientStep();
  const { currentFormData, setFormData } = useRegisterClientForm();

  const methods = useForm<RegisterClientFirstStepSchemaType>({
    resolver: zodResolver(registerClientFirstStepSchema),
    defaultValues: {
      name: currentFormData.name || "",
      email: currentFormData.email || "",
      phone:
        (currentFormData.areaCode &&
          currentFormData.phone &&
          currentFormData.areaCode + currentFormData.phone) ||
        "",
      areaCode: currentFormData.areaCode || "",
      homepage: currentFormData.homepage || "",
      storeCode: currentFormData.storeCode || "",
    },
  });

  const onSubmit = (data: RegisterClientFirstStepSchemaType) => {
    setFormData(data);
    next();
  };

  return (
    <FormWrapper method={methods}>
      <form
        id="register_client_step_1"
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div>
            <h2 className="text-zinc-800 text-2xl font-bold">Dados iniciais</h2>
            <p className="text-zinc-400">
              Insira algumas informações sobre cliente
            </p>
          </div>
          <div className="grid grid-cols-2 grid-rows-5 gap-5">
            <div className="col-span-1 row-span-4 space-y-5">
              <TextField<RegisterClientFirstStepSchemaType>
                name="name"
                required
                label="Nome"
              />
              <TextField<RegisterClientFirstStepSchemaType>
                name="email"
                label="Email"
              />
              <TextField<RegisterClientFirstStepSchemaType>
                name="phone"
                mask="phone"
                label="Numero de contato"
              />
              <TextField<RegisterClientFirstStepSchemaType>
                name="homepage"
                label="Home page"
              />
            </div>
            <div>
              <SelectStore<RegisterClientFirstStepSchemaType> name="storeCode" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Avançar
            </Button>
          </div>
        </div>
      </form>
    </FormWrapper>
  );
};
