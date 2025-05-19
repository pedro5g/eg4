import { RegisterClientFormContext } from "@/components/forms/register-client-form/provider/form-context";
import { RegisterClientForms } from "@/components/forms/register-client-form/register-forms";
import { Helmet } from "react-helmet-async";

export function Clients() {
  return (
    <>
      <Helmet title="Cadastro de clientes" />
      <div>
        <RegisterClientFormContext>
          <RegisterClientForms />
        </RegisterClientFormContext>
      </div>
    </>
  );
}
