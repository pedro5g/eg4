import { RegisterInvoiceForm } from "@/components/invoice/register-invoice-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";

export function InvoicePage() {
  const clientCode = useParams()["clientCode"];

  return (
    <>
      <Helmet title="Cadastro de faturas" />
      <div className="container mx-auto space-y-4 my-4">
        <header>
          <div>
            <h1 className="text-5xl text-zinc-800 font-bold ">
              Cadastro de faturas
            </h1>
            <p className="text-muted-foreground text-base ">
              cadastre as faturas de suas clientes aqui
            </p>
          </div>
        </header>
        <main>
          <RegisterInvoiceForm clientCode={clientCode} />
        </main>
      </div>
    </>
  );
}
