import { RegisterClientFormContext } from "@/components/forms/clients-forms/form-context";
import { RegisterClientForms } from "@/components/forms/clients-forms/register-forms";

export function Clients() {
  return (
    <div>
      <RegisterClientFormContext>
        <RegisterClientForms />
      </RegisterClientFormContext>
    </div>
  );
}
