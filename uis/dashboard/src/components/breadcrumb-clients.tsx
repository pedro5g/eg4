import { Link, useLocation, useParams } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { cn } from "@/lib/utils";

export const BreadcrumbClients = () => {
  const { pathname } = useLocation();
  const clientCode = useParams()["clientCode"];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="hover:text-blue-400" asChild>
            <Link
              className={cn(
                "text-base ",
                pathname === "/clients" &&
                  "text-blue-500 hover:text-blue-500 font-semibold"
              )}
              to="/clients">
              Registrar novo cliente
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          className={cn(
            pathname === "/clients/table" && "text-blue-500 font-semibold"
          )}
        />
        <BreadcrumbItem>
          <BreadcrumbLink className="hover:text-blue-400" asChild>
            <Link
              className={cn(
                "text-base ",
                pathname === "/clients/table" &&
                  "text-blue-500 hover:text-blue-500 font-semibold"
              )}
              to="/clients/table">
              Tabela de Clientes
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {clientCode && (
          <>
            <BreadcrumbSeparator
              className={cn(clientCode && "text-blue-500 font-semibold")}
            />
            <BreadcrumbItem>
              <BreadcrumbLink
                className={cn(
                  "text-base hover:text-blue-400",
                  clientCode &&
                    "text-blue-500 hover:text-blue-500 font-semibold"
                )}>
                Perfil do cliente
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
