import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { RegisterClientSchemaType } from "./schemas/register-client-form-schema";
import { parseAsInteger, useQueryState } from "nuqs";

type Props = {
  currentStep: number;
  currentFormData: Optional<RegisterClientSchemaType>;
  next: () => void;
  prev: () => void;
  clearFormData: () => void;
  setFormData: (data: Optional<RegisterClientSchemaType>) => void;
};

const FormProvider = createContext<Props | null>(null);

const LOCAL_STORAGE_KEY = "register_client_form";

type Optional<T> = { [K in keyof T]?: T[K] };

export const RegisterClientFormContext = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [_formData, _setFormData] = useState<
    Optional<RegisterClientSchemaType>
  >(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  });
  const [currentStep, setCurrentStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1)
  );

  const next = () => {
    setCurrentStep((step) => step + 1);
  };
  const prev = () => {
    setCurrentStep((step) => {
      if (step <= 0) return 1;
      return step - 1;
    });
  };

  const clearFormData = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setFormData({});
  }, []);

  const setFormData = useCallback(
    (data: Optional<RegisterClientSchemaType>) => {
      _setFormData((prev) => {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ ...prev, ...data })
        );
        return { ...prev, ...data };
      });
    },
    []
  );

  useEffect(() => {
    return () => clearFormData();
  }, []);

  return (
    <FormProvider.Provider
      value={{
        currentStep,
        currentFormData: _formData,
        setFormData,
        clearFormData,
        prev,
        next,
      }}>
      {children}
    </FormProvider.Provider>
  );
};

export const useRegisterClientForm = () => {
  const context = useContext(FormProvider);

  if (!context) {
    throw new Error(
      "useRegisterClientForm must be used within RegisterClientFormContext"
    );
  }
  return context;
};
