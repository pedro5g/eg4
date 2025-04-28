import { BreadcrumbClients } from "@/components/breadcrumb-clients";
import { Outlet } from "react-router";

export function ClientsLayout() {
  return (
    <div className="w-full h-full">
      <header className="w-full flex items-center h-10 container mx-auto px-10 py-8 border-b">
        <div className="flex items-center w-full max-w-2xl">
          <BreadcrumbClients />
        </div>
      </header>
      <div className="flex-1 container mx-auto px-10">
        <Outlet />
      </div>
    </div>
  );
}
