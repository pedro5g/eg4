import { useState } from "react";
import { useDebounceCallback } from "./use-debounce";
import { cnpja } from "@/lib/cnpj";

export interface UseCnpjProps {
  setTradeName: (value: string | null) => void;
  setOpeningDate: (value: string | null) => void;
  setTaxId: (value: string) => void;
  setType: (value: string) => void;
  setTaxIdError: (error: string) => void;
  clearError: () => void;
  focusControl: () => void;
}

export const useCnpj = (methods: UseCnpjProps) => {
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);

  const handleCpfCnpj = useDebounceCallback(async (value: string) => {
    if (value.length === 14) {
      try {
        setIsFetchingCnpj(true);
        methods.clearError();

        const data = await cnpja.office.read({
          taxId: value,
        });

        methods.setTradeName(data.alias || data.company.name);
        methods.setOpeningDate(data.founded.split("-").reverse().join(""));
        methods.setType("J");
      } catch (e) {
        console.log(e);
        methods.setTaxIdError("CNPJ invalido");
      } finally {
        setIsFetchingCnpj(false);
      }
    }
    if (value.length === 11) {
      methods.setTradeName(null);
      methods.setOpeningDate(null);
      methods.setType("F");
    }
    methods.focusControl();
  }, 200);

  return { handleCpfCnpj, isFetchingCnpj };
};
