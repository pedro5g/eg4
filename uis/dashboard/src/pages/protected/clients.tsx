import { RegisterClientFormContext } from "@/components/forms/register-client-form/provider/form-context";
import { RegisterClientForms } from "@/components/forms/register-client-form/register-forms";

export function Clients() {
  return (
    <div>
      <RegisterClientFormContext>
        <RegisterClientForms />
      </RegisterClientFormContext>
    </div>
  );
}
