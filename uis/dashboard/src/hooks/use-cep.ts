import { useState } from "react";
import { useDebounceCallback } from "./use-debounce";

export interface UseCepProps {
  setAddress: (value: string) => void;
  setCity: (value: string) => void;
  setState: (value: string) => void;
  setNeighborhood: (value: string) => void;
  setCityCode: (value: string) => void;
  setHouseNumber: (value: string) => void;
  setZipError: (error: string) => void;
  setCountry: (value: string) => void;
  clearError: () => void;
}

export const useCep = (methods: UseCepProps) => {
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const handleCep = useDebounceCallback(async (cep: string) => {
    if (cep.length !== 8) return;
    try {
      setIsFetchingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        methods.setZipError("CEP não encontrado");
        return;
      }
      methods.setAddress(data.logradouro);
      methods.setCity(data.localidade);
      methods.setState(data.uf);
      methods.setNeighborhood(data.bairro);
      methods.setCityCode(data.ibge);
      methods.setCountry("BR");
      methods.setHouseNumber("");
      methods.clearError();
    } catch (e) {
      console.log(e);
      methods.setZipError("CEP invalido");
    } finally {
      setIsFetchingCep(false);
    }
  }, 500);

  return { handleCep, isFetchingCep };
};
